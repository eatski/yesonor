import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { answer as answerSchema } from "../../model/schemas";
import { procedure } from "../../trpc";
import { getStory, getStoryPrivate } from "@/server/services/story";
import { pickSmallDistanceExampleQuestionInput } from "./pickSmallDistanceExampleQuestionInput";
import { QuestionExampleWithCustomMessage } from "./type";
import { QuestionExample } from "@/server/model/types";
import { prisma } from "@/libs/prisma";
import { questionToAI } from "./questionToAI";

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
			const [[story, user]] = await Promise.all([
				ctx.getUserOptional().then(async (user) => {
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
					return [story, user] as const;
				}),
				ctx.verifyRecaptcha(input.recaptchaToken),
			]);

			const questionExampleWithCustomMessage = filterWithCustomMessage(
				story.questionExamples,
			);

			const [answer, nearestQuestionExample] = await Promise.all([
				questionToAI(ctx.openai, story, input.text).then(async (answer) => {
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
				}),
				questionExampleWithCustomMessage.length
					? pickSmallDistanceExampleQuestionInput(
							input.text,
							questionExampleWithCustomMessage,
							ctx.openai,
					  ).catch(() => null)
					: null,
			]);

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
