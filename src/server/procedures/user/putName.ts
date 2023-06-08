import { prisma } from "@/libs/prisma";
import { procedure } from "@/server/trpc";
import { z } from "zod";

export const putName = procedure
	.input(
		z.object({
			name: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const data = await prisma.user.update({
			where: {
				id: (await ctx.getUser()).id,
			},
			data: {
				name: input.name,
			},
		});
		return data.name;
	});
