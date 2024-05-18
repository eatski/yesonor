import type { storyInit } from "@/server/model/story";
import { procedure } from "@/server/trpc";
import { PrismaClient } from "@prisma/client";
import type { z } from "zod";

export type Input = z.infer<typeof storyInit>;

export const deleteAccount = procedure.mutation(async ({ ctx }) => {
	const prisma = new PrismaClient();
	await prisma.user.delete({
		where: {
			id: (await ctx.getUser()).id,
		},
	});
	return true;
});
