import { storyInit } from "@/server/model/story";
import { procedure } from "@/server/trpc";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

export type Input = z.infer<typeof storyInit>;

export const put = procedure
	.input(
		z.object({
			id: z.string(),
			story: storyInit,
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const prisma = new PrismaClient();
		const { id, story } = input;
		const { questionExamples, ...storyData } = story;
		await prisma.story.updateMany({
			where: {
				id: id,
				authorId: (await ctx.getUser()).id,
			},
			data: {
				...storyData,
				questionExamples: JSON.stringify(questionExamples),
			},
		});
		return true;
	});
