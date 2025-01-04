import { revalidateTime } from "@/common/revalidate";
import { prisma } from "@/libs/prisma";
import type { StoryHead } from "@/server/model/story";
import { nextCache } from "@/server/serverComponent/nextCache";
import { createGetStoryWhere, omitStory } from "./functions";

export const getStories = nextCache(
	(args: { count: number }): Promise<StoryHead[]> => {
		return prisma.story
			.findMany({
				take: args.count,
				where: createGetStoryWhere({}),
				orderBy: {
					publishedAt: "desc",
				},
				include: {
					author: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			})
			.then((stories) => stories.map(omitStory));
	},
	["getStories"],
	{
		revalidate: revalidateTime.short,
	},
);

export const getStoriesWithAuthorId = async (args: {
	authorId: string;
	includePrivate: boolean;
}): Promise<StoryHead[]> => {
	return prisma.story
		.findMany({
			where: {
				authorId: args.authorId,
				published: args.includePrivate ? undefined : true,
			},
			orderBy: [
				{
					publishedAt: "desc",
				},
				{
					createdAt: "desc",
				},
			],
			include: {
				author: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		})
		.then((stories) => stories.map(omitStory));
};
