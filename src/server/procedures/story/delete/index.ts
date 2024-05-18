import type { storyInit } from "@/server/model/story";
import { procedure } from "@/server/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export type Input = z.infer<typeof storyInit>;

export const delete_ = procedure
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const prisma = new PrismaClient();
		const result = await prisma.story.deleteMany({
			where: {
				id: input.id,
				authorId: await ctx.getUser().then((user) => user.id),
			},
		});
		if (result.count === 0) {
			throw new TRPCError({
				code: "NOT_FOUND",
			});
		}
		await ctx.doRevalidate(`/stories/${input.id}`).catch();
		return true;
	});
