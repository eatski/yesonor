import { revalidateTime } from "@/common/revalidate";
import { prisma } from "@/libs/prisma";
import type { Story, StoryHead } from "@/server/model/story";
import { nextCache } from "@/server/serverComponent/nextCache";
import {
	createGetStoryPrivateWhere,
	createGetStoryWhere,
	hydrateStory,
	omitStory,
} from "./functions";

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
					author: true,
				},
			})
			.then((stories) => stories.map(omitStory));
	},
	["getStories"],
	{
		revalidate: revalidateTime.short,
	},
);

type FilterForFindFirst =
	| {
			type: "onlyPublic" | "includePrivate";
	  }
	| {
			type: "publicOrWithAuthor" | "withAuthorId";
			authorId: string;
	  };

const cacheKeyByFilter = (filter: FilterForFindFirst) => {
	const simpleTypedFilter: {
		type: FilterForFindFirst["type"];
		authorId?: string;
	} = filter;
	return [simpleTypedFilter.type, simpleTypedFilter.authorId].filter(
		(v) => v != null,
	);
};

const createFindFirstWhereByFilter = (
	storyId: string,
	filter: FilterForFindFirst,
): {} & NonNullable<Parameters<typeof prisma.story.findFirst>[0]>["where"] => {
	switch (filter.type) {
		case "onlyPublic":
			return {
				id: storyId,
				published: true,
			};
		case "includePrivate":
			return {
				id: storyId,
			};
		case "publicOrWithAuthor":
			return {
				id: storyId,
				OR: [
					{
						published: true,
					},
					{
						authorId: filter.authorId,
					},
				],
			};
		case "withAuthorId":
			return {
				id: storyId,
				authorId: filter.authorId,
			};
	}
};

export const getStory = ({
	storyId,
	filter,
}: {
	storyId: string;
	filter: FilterForFindFirst;
}): Promise<Story | null> => {
	return nextCache(
		() =>
			prisma.story
				.findFirst({
					where: {
						...createFindFirstWhereByFilter(storyId, filter),
					},
					include: {
						author: true,
					},
				})
				.then((story) => {
					if (story == null) return null;
					return hydrateStory(story);
				}),
		["_getStory", storyId, ...cacheKeyByFilter(filter)],
		{
			revalidate: revalidateTime.short,
			tags: [`/stories/${storyId}`],
		},
	)();
};

export const getStoryHead = (args: {
	storyId: string;
}): Promise<StoryHead | null> => {
	return prisma.story
		.findFirst({
			where: createGetStoryWhere(args),
			include: {
				author: true,
			},
		})
		.then((story) => {
			if (story == null) return null;
			return omitStory(story);
		});
};

export const getStoryPrivate = async (args: {
	storyId: string;
	authorId: string;
}): Promise<Story | null> => {
	return nextCache(
		() => {
			return prisma.story
				.findFirst({
					where: createGetStoryPrivateWhere(args),
					include: {
						author: true,
					},
				})
				.then((story) => {
					if (story == null) return null;
					return hydrateStory(story);
				});
		},
		["getStoryPrivate", args.storyId, args.authorId],
		{
			revalidate: revalidateTime.short,
			tags: [`/stories/${args.storyId}`],
		},
	)();
};

export const getStoryWithWithAuthorId = async (args: {
	storyId: string;
	authorId: string;
}): Promise<Story | null> => {
	return prisma.story
		.findFirst({
			where: {
				id: args.storyId,
				authorId: args.authorId,
			},
			include: {
				author: true,
			},
		})
		.then((story) => {
			if (story == null) return null;
			return hydrateStory(story);
		});
};

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
				author: true,
			},
		})
		.then((stories) => stories.map(omitStory));
};
