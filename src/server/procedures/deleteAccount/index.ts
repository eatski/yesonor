import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { storyInit } from "@/server/model/story";

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
