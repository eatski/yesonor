import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
	answer as answerSchema,
	filterWithCustomMessage,
	QuestionExample,
} from "../../model/story";
import { procedure } from "../../trpc";
import { getStory, getStoryPrivate } from "@/server/services/story";
import { pickSmallDistanceExampleQuestionInput } from "./pickSmallDistanceExampleQuestionInput";
import { QuestionExampleWithCustomMessage } from "./type";
import { prisma } from "@/libs/prisma";
import { questionToAI } from "./questionToAI";
import { prepareProura } from "@/libs/proura";

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
			const proura = prepareProura();
			const { hitQuestionExample, question: answer } = await proura
				.add("verifyRecaptcha", () => {
					return ctx.verifyRecaptcha(input.recaptchaToken);
				})
				.add("user", () => {
					return ctx.getUserOptional();
				})
				.add("story", async (dependsOn) => {
					const user = await dependsOn("user");
					const story = await (user
						? getStoryPrivate({
								storyId: input.storyId,
								authorId: user.id,
						  })
						: getStory({
								storyId: input.storyId,
						  }));
					if (!story) {
						throw new TRPCError({
							code: "NOT_FOUND",
						});
					}
					return story;
				})

				.add("question", async (dependsOn) => {
					await dependsOn("verifyRecaptcha");
					const user = await dependsOn("user");
					const story = await dependsOn("story");
					const answer = await questionToAI(ctx.openai, story, input.text);
					const isOwn = user?.id === story.author.id;
					!isOwn &&
						(await prisma.questionLog
							.create({
								data: {
									question: input.text,
									answer,
									storyId: story.id,
								},
							})
							.catch((e) => {
								console.error(e);
							}));

					return answer;
				})
				.add("hitQuestionExample", async (dependsOn) => {
					await dependsOn("verifyRecaptcha");
					const story = await dependsOn("story");
					const questionExampleWithCustomMessage = filterWithCustomMessage(
						story.questionExamples,
					);
					const nearestQuestionExample = questionExampleWithCustomMessage.length
						? await pickSmallDistanceExampleQuestionInput(
								input.text,
								questionExampleWithCustomMessage,
								ctx.openai,
						  )
						: null;
					const answer = await dependsOn("question");
					return nearestQuestionExample?.answer === answer
						? nearestQuestionExample
						: null;
				})
				.exec();
			return {
				answer,
				hitQuestionExample,
			};
		},
	);
