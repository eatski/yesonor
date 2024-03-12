import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { QuestionExample, answer as answerSchema } from "../../model/story";
import { procedure } from "../../trpc";
import { QuestionExampleWithCustomMessage } from "./type";
import { prisma } from "@/libs/prisma";
import { questionToAI } from "./questionToAIClaude";
import { prepareProura } from "@/libs/proura";
import { calculateEuclideanDistance } from "@/libs/math";
import {
	createGetStoryPrivateWhere,
	createGetStoryWhere,
	hydrateStory,
} from "@/server/services/story/functions";
import DataLoader from "dataloader";

const SIMULAR_QUESTION_DISTANCE = 0.13;

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
			const embeddingsDataLoader = new DataLoader(
				(texts: readonly string[]) => {
					return ctx.openai
						.createEmbedding({
							model: "text-embedding-ada-002",
							input: [...texts],
						})
						.then((res) => res.data.data);
				},
			);
			const { hitQuestionExample, question: answer } = await proura
				.add("verifyRecaptcha", () => {
					return ctx.verifyRecaptcha(input.recaptchaToken);
				})
				.add("user", () => {
					return ctx.getUserOptional();
				})
				.add("story", async (dependsOn) => {
					const user = await dependsOn("user");
					const storyWhere = user
						? createGetStoryPrivateWhere({
								storyId: input.storyId,
								authorId: user.id,
						  })
						: createGetStoryWhere({
								storyId: input.storyId,
						  });
					const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
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
				})
				.add("inputEmbedding", async () => {
					return embeddingsDataLoader.load(input.text);
				})
				.add("examplesWithDistance", async (dependsOn) => {
					const story = await dependsOn("story");
					const embeddings = await embeddingsDataLoader.loadMany(
						story.questionExamples.map(({ question }) => question),
					);
					const inputEmbedding = await dependsOn("inputEmbedding");
					const result: {
						example: QuestionExample;
						distance: number;
					}[] = [];
					embeddings.forEach((embedding, index) => {
						const example = story.questionExamples[index];
						if (!example) {
							throw new Error("index out of range");
						}
						if (embedding instanceof Error) {
							console.error(embedding);
							return;
						}
						const distance = calculateEuclideanDistance(
							inputEmbedding.embedding,
							embedding.embedding,
						);
						result.push({
							example,
							distance,
						});
					});
					result.sort((a, b) => a.distance - b.distance);
					return result;
				})
				.add("question", async (dependsOn) => {
					await dependsOn("verifyRecaptcha");
					const user = await dependsOn("user");
					const story = await dependsOn("story");
					const examples = await dependsOn("examplesWithDistance");
					const PICK_NUM = 3;
					const pickedFewExamples = examples.slice(0, PICK_NUM);
					const answer = await questionToAI(
						{
							quiz: story.quiz,
							truth: story.truth,
							questionExamples: pickedFewExamples.map(({ example }) => example),
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
					const answer = await dependsOn("question");
					const examples = await dependsOn("examplesWithDistance");
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
