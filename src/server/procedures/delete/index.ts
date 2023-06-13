import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { storyInit } from "@/server/model/schemas";
import { TRPCError } from "@trpc/server";

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
		ctx.doRevalidate(`/stories/${input.id}`);
		return true;
	});
