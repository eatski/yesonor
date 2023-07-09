import { calculateEuclideanDistance } from "@/libs/math";
import { prisma } from "@/libs/prisma";
import { truthCoincidence } from "@/server/model/schemas";
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
		const systemPrompt = await systemPromptPromise;
		const [chatResponse, embeddingsResponse] = await Promise.all([
			ctx.openai.createChatCompletion({
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
			}),
			ctx.openai.createEmbedding({
				model: "text-embedding-ada-002",
				input: [story.simpleTruth, input.text],
			}),
		]);
		const [textA, textB] = embeddingsResponse.data.data;
		const distance = calculateEuclideanDistance(
			textA.embedding,
			textB.embedding,
		);
		const message = chatResponse.data.choices[0].message;
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
		return {
			result,
			input: input.text,
			truth: result === "Covers" ? story.truth : null,
			distance: Math.round(distance * 100) / 100,
		};
	});
