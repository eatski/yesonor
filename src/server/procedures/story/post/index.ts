import { generateId } from "@/common/util/id";
import { storyInit } from "@/server/model/story";
import { procedure } from "@/server/trpc";
import { PrismaClient } from "@prisma/client";
import type { z } from "zod";

export type Input = z.infer<typeof storyInit>;

export const post = procedure
	.input(storyInit)
	.mutation(async ({ input, ctx }) => {
		const prisma = new PrismaClient();
		const { questionExamples, ...storyData } = input;
		const user = await ctx.getUser();
		// create story and associated questionExamples
		const story = await prisma.story.create({
			data: {
				...storyData,
				id: generateId(),
				questionExamples: JSON.stringify(questionExamples),
				authorId: user.id,
			},
		});
		return story;
	});
