import { FALLBACK_DISTANCE, calculateEuclideanDistance } from "@/libs/math";
import { prisma } from "@/libs/prisma";
import { prepareProura } from "@/libs/proura";
import { truthCoincidence } from "@/server/model/story";
import { getStory, getStoryPrivate } from "@/server/services/story";
import { procedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createPrompt } from "./createPrompt";
import { openai } from "@/libs/openai";

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
				const systemPrompt = await createPrompt(input.text, story.simpleTruth);
				const schema = z.object({
					is_covered: truthCoincidence,
				});

				const { choices } = await openai.chat.completions.create({
					model: "gpt-4-0613",
					messages: [
						{
							role: "user",
							content: systemPrompt,
						},
					],
					user: "testes",
					function_call: {
						name: "is_covered",
					},
					functions: [
						{
							name: "is_covered",
							description:
								"Check if the user's statement is covered by the assistant's statement.",
							parameters: zodToJsonSchema(schema),
						},
					],
					temperature: 0.0,
					max_tokens: 10,
				});
				const args = choices[0]?.message?.function_call?.arguments;
				if (!args) {
					throw new Error("No args");
				}
				const { is_covered } = schema.parse(JSON.parse(args));
				const correct = is_covered === "Covers" ? story.truth : null;
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
				return is_covered;
			})
			.exec();

		return {
			result: is_covered,
			input: input.text,
			distance: Math.round(distance * 100) / 100,
		};
	});
