import { openai } from "@/libs/openai";
import { TRPCError } from "@trpc/server";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { z } from "zod";
import {
	answer,
	questionExample as questionExampleSchema,
} from "../../model/schemas";
import { procedure } from "../../trpc";
import { parseHeadToken } from "./parse";
import { getStory, getStoryPrivate } from "@/server/services/story";

const systemPromptPromise = readFile(
	resolve(process.cwd(), "prompts", "question.md"),
);

export const question = procedure
	.input(
		z.object({
			storyId: z.string(),
			text: z.string(),
			recaptchaToken: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const systemPrompt = await systemPromptPromise;
		const verifyPromise = ctx.verifyRecaptcha(input.recaptchaToken);
		const user = await ctx.getUserOptional();
		const story = user
			? await getStoryPrivate({
					storyId: input.storyId,
					autherEmail: user.email,
			  })
			: await getStory({
					storyId: input.storyId,
			  });
		if (!story) {
			throw new TRPCError({
				code: "NOT_FOUND",
			});
		}
		await verifyPromise;
		const response = await ctx.openai.createChatCompletion({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content: systemPrompt.toString(),
				},
				{
					role: "assistant",
					content: story.quiz,
				},
				{
					role: "assistant",
					content: story.truth,
				},
				...story.questionExamples.flatMap(
					({ question: question, answer: answer, supplement }) => {
						return [
							{
								role: "user",
								content: question,
							},
							{
								role: "assistant",
								content: answer + ": " + supplement,
							},
						] as const;
					},
				),
				{
					role: "user",
					content: input.text,
				},
			],
			temperature: 0,
			max_tokens: 10,
		});
		const message = response.data.choices[0].message;
		if (!message) {
			throw new Error("No message");
		}
		return answer.parse(parseHeadToken(message.content));
	});
