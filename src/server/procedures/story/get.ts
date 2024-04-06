import { getStoryPrivate } from "@/server/services/story";
import { procedure } from "@/server/trpc";
import { z } from "zod";

export const getByIdPrivate = procedure
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.query(async ({ input, ctx }) => {
		return getStoryPrivate({
			storyId: input.id,
			authorId: await ctx.getUser().then((author) => author.id),
		});
	});
