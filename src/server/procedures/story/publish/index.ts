import { procedure } from "@/server/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const publishFirst = procedure
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const prisma = new PrismaClient();
		const { id } = input;
		const result = await prisma.story.updateMany({
			where: {
				id: id,
				authorId: (await ctx.getUser()).id,
				published: false,
				publishedAt: null,
			},
			data: {
				published: true,
				publishedAt: new Date(),
			},
		});

		if (result.count === 0) {
			throw new TRPCError({
				code: "NOT_FOUND",
			});
		}
		await ctx.doRevalidate(`/stories/${id}`).catch();
		return true;
	});
