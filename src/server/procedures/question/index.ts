import { TRPCError } from "@trpc/server";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { z } from "zod";
import { answer as answerSchema } from "../../model/schemas";
import { procedure } from "../../trpc";
import { getStory, getStoryPrivate } from "@/server/services/story";
import { pickSmallDistanceExampleQuestionInput } from "./pickSmallDistanceExampleQuestionInput";
import { prisma } from "@/libs/prisma";

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
	.mutation(
		async ({
			input,
			ctx,
		}): Promise<{
			answer: z.infer<typeof answerSchema>;
			customMessage?: string;
		}> => {
			const verifyPromise = ctx.verifyRecaptcha(input.recaptchaToken);
			const user = await ctx.getUserOptional();
			const story = user
				? await getStoryPrivate({
						storyId: input.storyId,
						authorId: user.id,
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

			const questionExampleWithCustomMessage = story.questionExamples.filter(
				(questionExample) => questionExample.customMessage,
			);

			const nearestQuestionExample = questionExampleWithCustomMessage.length
				? await pickSmallDistanceExampleQuestionInput(
						input.text,
						questionExampleWithCustomMessage,
						ctx.openai,
				  )
				: null;

			const response = await ctx.openai.createChatCompletion({
				model: "gpt-4-0613",
				function_call: {
					name: "asnwer",
				},
				functions: [
					{
						name: "asnwer",
						description: "Anser the question",
						parameters: {
							type: "object",
							properties: {
								answer: {
									type: "string",
									enum: ["True", "False", "Unknown"],
								},
							},
						},
					},
				],
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
						({ question, answer, supplement }) => {
							return [
								{
									role: "user",
									content: question,
								},
								{
									role: "assistant",
									content: supplement ? `${answer}:${supplement}` : answer,
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
			});

			const args = response.data.choices[0].message?.function_call?.arguments;
			if (!args) {
				throw new Error("No args");
			}
			const answer = answerSchema.parse(JSON.parse(args).answer);
			prisma.questionLog
				.create({
					data: {
						storyId: story.id,
						question: input.text,
						answer,
					},
				})
				.catch((e) => {
					console.error(e);
				});
			return {
				answer,
				customMessage:
					nearestQuestionExample?.answer === answer
						? nearestQuestionExample.customMessage
						: undefined,
			};
		},
	);
