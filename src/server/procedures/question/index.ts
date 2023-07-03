import { TRPCError } from "@trpc/server";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { z } from "zod";
import { answer as answerSchema } from "../../model/schemas";
import { procedure } from "../../trpc";
import { getStory, getStoryPrivate } from "@/server/services/story";
import { pickSmallDistanceExampleQuestionInput } from "./pickSmallDistanceExampleQuestionInput";
import { OPENAI_ERROR_MESSAGE } from "./contract";
import { QuestionExampleWithCustomMessage } from "./type";
import { QuestionExample } from "@/server/model/types";
import { prisma } from "@/libs/prisma";

const systemPromptPromise = readFile(
	resolve(process.cwd(), "prompts", "question.md"),
);

const filterWithCustomMessage = (
	examples: QuestionExample[],
): QuestionExampleWithCustomMessage[] => {
	const filterd: QuestionExampleWithCustomMessage[] = [];
	for (const example of examples) {
		if (example.customMessage) {
			filterd.push({
				...example,
				customMessage: example.customMessage,
			});
		}
	}
	return filterd;
};

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
			hitQuestionExample: QuestionExampleWithCustomMessage | null;
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

			const questionExampleWithCustomMessage = filterWithCustomMessage(
				story.questionExamples,
			);

			const nearestQuestionExamplePromise =
				questionExampleWithCustomMessage.length
					? pickSmallDistanceExampleQuestionInput(
							input.text,
							questionExampleWithCustomMessage,
							ctx.openai,
					  ).catch(() => null)
					: null;

			const response = await ctx.openai
				.createChatCompletion({
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
				})
				.catch((e) => {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: OPENAI_ERROR_MESSAGE,
						cause: e,
					});
				});
			const args = response.data.choices[0].message?.function_call?.arguments;
			if (!args) {
				throw new Error("No args");
			}
			const answer = answerSchema.parse(JSON.parse(args).answer);
			const isOwn = user?.id === story.authorId;
			isOwn &&
				prisma.questionLog.create({
					data: {
						question: input.text,
						answer,
						storyId: story.id,
					},
				});
			const nearestQuestionExample = await nearestQuestionExamplePromise;

			const hitQuestionExample =
				nearestQuestionExample?.answer === answer
					? nearestQuestionExample
					: null;

			return {
				answer,
				hitQuestionExample,
			};
		},
	);
