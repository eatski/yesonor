import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { storyInit } from "@/server/model/story";

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
		ctx.doRevalidate(`/stories/${input.id}`).catch();
		return true;
	});
