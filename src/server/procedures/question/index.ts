import { openai } from "@/libs/openai";
import { TRPCError } from "@trpc/server";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { z } from "zod";
import {
	answer,
} from "../../model/schemas";
import { procedure } from "../../trpc";
import { parseHeadToken } from "./parse";
import { getStory, getStoryPrivate } from "@/server/services/story";
import { pickSmallDistanceExampleQuestionInput } from "./pickSmallDistanceExampleQuestionInput";

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
	.mutation(async ({ input, ctx }): Promise<{
		answer: z.infer<typeof answer>;
		customMessage?: string;
	}> => {
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

		const questionExampleWithCustomMessage = story.questionExamples.filter((questionExample) => questionExample.customMessage);

		const nearestQuestionExample = questionExampleWithCustomMessage.length ?  await pickSmallDistanceExampleQuestionInput(
			input.text,
			questionExampleWithCustomMessage,
			openai
		) : null
		
		const response = await ctx.openai.createChatCompletion({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content: (await systemPromptPromise).toString(),
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
			max_tokens: 2,
		});
		const message = response.data.choices[0].message;
		if (!message) {
			throw new Error("No message");
		}
		return {
			answer:answer.parse(parseHeadToken(message.content)),
			customMessage: nearestQuestionExample?.customMessage,
		};
	});
