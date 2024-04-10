import { prisma } from "@/libs/prisma";
import { procedure } from "@/server/trpc";
import { z } from "zod";

export const post = procedure
	.input(
		z.object({
			storyId: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const user = await ctx.getUserOptional();
		if (!user) {
			return null;
		}
		const init = {
			storyId: input.storyId,
			rating: 4,
			userId: user.id,
		};
		const data = await prisma.storyEvaluation.upsert({
			create: init,
			update: init,
			where: {
				storyId_userId: {
					storyId: input.storyId,
					userId: user.id,
				},
			},
		});
		return data.id;
	});
