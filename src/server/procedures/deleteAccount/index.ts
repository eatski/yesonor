import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { storyInit } from "@/server/model/schemas";

export type Input = z.infer<typeof storyInit>;

export const deleteAccount = procedure.mutation(async ({ ctx }) => {
	const prisma = new PrismaClient();
	await prisma.story.deleteMany({
		where: {
			authorEmail: await ctx.getUser().then((user) => user.email),
		},
	});
	return true;
});
