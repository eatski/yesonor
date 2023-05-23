import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { storyInit } from "@/server/services/story/schema";
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
				authorEmail: await ctx.getUser().then((user) => user.email),
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
