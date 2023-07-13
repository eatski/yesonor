import { calculateEuclideanDistance } from "@/libs/math";
import { prisma } from "@/libs/prisma";
import { prepareProura } from "@/libs/proura";
import { truthCoincidence } from "@/server/model/story";
import { getStory, getStoryPrivate } from "@/server/services/story";
import { procedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { z } from "zod";

const systemPromptPromise = readFile(
	resolve(process.cwd(), "prompts", "truth.md"),
);

export const truth = procedure
	.input(
		z.object({
			storyId: z.string(),
			text: z.string(),
			recaptchaToken: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const proura = prepareProura();
		const { result, story, distance } = await proura
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
			.add("distance", async (dependsOn) => {
				await dependsOn("verifyRecaptcha");
				const story = await dependsOn("story");
				const embeddingsResponse = await ctx.openai.createEmbedding({
					model: "text-embedding-ada-002",
					input: [story.simpleTruth, input.text],
				});
				const [textA, textB] = embeddingsResponse.data.data;
				const distance = calculateEuclideanDistance(
					textA.embedding,
					textB.embedding,
				);
				return distance;
			})
			.add("result", async (dependsOn) => {
				await dependsOn("verifyRecaptcha");
				const story = await dependsOn("story");
				const user = await dependsOn("user");
				const systemPrompt = await systemPromptPromise;
				const response = await ctx.openai.createChatCompletion({
					model: "gpt-4-0613",
					messages: [
						{
							role: "system",
							content: systemPrompt.toString(),
						},
						{
							role: "assistant",
							content: story.simpleTruth,
						},
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
				const result = truthCoincidence.parse(message.content);

				const correct = result === "Covers" ? story.truth : null;
				const isOwn = user?.id === story.author.id;
				isOwn ||
					(await prisma.solutionLog
						.create({
							data: {
								storyId: story.id,
								solution: input.text,
								result: correct ? "Correct" : "Incorrect",
							},
						})
						.catch((e) => {
							console.error(e);
						}));
				return result;
			})
			.exec();

		return {
			result,
			input: input.text,
			truth: result === "Covers" ? story.truth : null,
			distance: Math.round(distance * 100) / 100,
		};
	});
