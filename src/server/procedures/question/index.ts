import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { answer as answerSchema } from "../../model/story";
import { procedure } from "../../trpc";
import { QuestionExampleWithCustomMessage } from "./type";
import { prisma } from "@/libs/prisma";
import {
	createGetStoryPrivateWhere,
	createGetStoryWhere,
	hydrateStory,
} from "@/server/services/story/functions";
import { getAnswer } from "@/server/services/question";

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
			const userPromise = ctx.getUserOptional();
			const storyPromise = (async () => {
				const user = await userPromise;
				const storyWhere = user
					? createGetStoryPrivateWhere({
							storyId: input.storyId,
							authorId: user.id,
					  })
					: createGetStoryWhere({
							storyId: input.storyId,
					  });
				const storyDbData = await prisma.story.findFirst({
					where: storyWhere,
					include: {
						author: true,
					},
				});
				if (!storyDbData) {
					throw new TRPCError({
						code: "NOT_FOUND",
					});
				}
				return hydrateStory(storyDbData);
			})();
			const recapturePromise = ctx.verifyRecaptcha(input.recaptchaToken);
			const { answer, hitQuestionExample } = await getAnswer(
				input.text,
				storyPromise,
				recapturePromise,
				ctx.getABTestingVariant(),
			);
			const user = await userPromise;
			const story = await storyPromise;
			const isOwn = user?.id === story.author.id;
			// DBへの負荷を下げるため1/10の確率で質問ログを保存
			!isOwn &&
				Math.floor(Math.random() * 10) === 0 &&
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
			return {
				answer,
				hitQuestionExample,
			};
		},
	);
