import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { answer as answerSchema } from "../../model/story";
import { procedure } from "../../trpc";
import { getStory, getStoryPrivate } from "@/server/services/story";
import { QuestionExampleWithCustomMessage } from "./type";
import { prisma } from "@/libs/prisma";
import { questionToAI } from "./questionToAI";
import { prepareProura } from "@/libs/proura";
import { FALLBACK_DISTANCE, calculateEuclideanDistance } from "@/libs/math";

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
				.add("exampleWithDistance", async (dependsOn) => {
					await dependsOn("verifyRecaptcha");
					const story = await dependsOn("story");
					const embeddings = await ctx.openai
						.createEmbedding({
							model: "text-embedding-ada-002",
							input: [
								input.text,
								...story.questionExamples.map(({ question }) => question),
							],
						})
						.then((res) => res.data.data);
					const [inputEmbedding, ...exampleEmbeddings] = embeddings;

					if (!inputEmbedding) {
						console.error("embeddings is empty");
						return story.questionExamples.map((example) => ({
							example,
							distance: FALLBACK_DISTANCE,
						}));
					}
					return exampleEmbeddings.map((exampleEmbedding, index) => {
						const example = story.questionExamples[index];
						if (!example) {
							throw new Error("index out of range");
						}
						return {
							example: example,
							distance: calculateEuclideanDistance(
								inputEmbedding.embedding,
								exampleEmbedding.embedding,
							),
						};
					});
				})
				.add("question", async (dependsOn) => {
					await dependsOn("verifyRecaptcha");
					const user = await dependsOn("user");
					const story = await dependsOn("story");
					const examples = [...(await dependsOn("exampleWithDistance"))];
					examples.sort((a, b) => a.distance - b.distance);
					const picked4examples = examples.slice(0, 4);
					const answer = await questionToAI(
						ctx.openai,
						{
							quiz: story.quiz,
							truth: story.truth,
							questionExamples: picked4examples.map(({ example }) => example),
						},
						input.text,
					);
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
					const answer = await dependsOn("question");
					const examples = [...(await dependsOn("exampleWithDistance"))];
					examples.sort((a, b) => a.distance - b.distance);
					const recur = ([
						head,
						...tail
					]: typeof examples): QuestionExampleWithCustomMessage | null => {
						if (!head) {
							return null;
						}
						const { example, distance } = head;
						if (example.customMessage && distance < 0.3) {
							return {
								...example,
								customMessage: example.customMessage,
							};
						}
						return recur(tail);
					};
					const hit = recur(examples);
					return hit?.answer === answer ? hit : null;
				})
				.exec();
			return {
				answer,
				hitQuestionExample,
			};
		},
	);
