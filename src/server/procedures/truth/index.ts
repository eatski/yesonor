import { createMessage } from "@/libs/claude";
import { FALLBACK_DISTANCE, calculateEuclideanDistance } from "@/libs/math";
import { openai } from "@/libs/openai";
import { prisma } from "@/libs/prisma";
import { prepareProura } from "@/libs/proura";
import { getStory, getStoryPrivate } from "@/server/services/story";
import { procedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createPrompt } from "./createPrompt";

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
		const { is_covered, story, distance } = await proura
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
							includePrivate: false,
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
				const {
					data: [textA, textB],
				} = await openai.embeddings.create({
					model: "text-embedding-ada-002",
					input: [story.simpleTruth, input.text],
				});
				if (!textA || !textB) {
					return FALLBACK_DISTANCE;
				}
				const distance = calculateEuclideanDistance(
					textA.embedding,
					textB.embedding,
				);
				return distance;
			})
			.add("is_covered", async (dependsOn) => {
				await dependsOn("verifyRecaptcha");
				const story = await dependsOn("story");
				const user = await dependsOn("user");
				const systemPrompt = await createPrompt(story.simpleTruth);

				const { content } = await createMessage({
					model: "claude-3-opus-20240229",
					system: systemPrompt,
					messages: [
						{
							role: "user",
							content: input.text,
						},
					],
					temperature: 0.0,
					max_tokens: 8,
				});
				const text = content[0]?.type === "text" ? content[0].text : null;
				const result = (["Correct", "Incorrect"] as const).find((word) =>
					text?.includes(word),
				);
				if (!result) {
					throw new Error(`Unexpected response from Claude: ${content}`);
				}
				const correct = result === "Correct" ? story.truth : null;
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
			result: is_covered,
			input: input.text,
			distance: Math.round(distance * 100) / 100,
		};
	});
