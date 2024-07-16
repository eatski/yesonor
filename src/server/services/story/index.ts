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

export const getStory = (args: {
	storyId: string;
	includePrivate: boolean;
}): Promise<Story | null> => {
	return prisma.story
		.findFirst({
			where: {
				id: args.storyId,
				published: args.includePrivate ? undefined : true,
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
};

export const getStoryHeadPrivate = async (args: {
	storyId: string;
	authorId: string;
}): Promise<StoryHead | null> => {
	return prisma.story
		.findFirst({
			where: createGetStoryPrivateWhere(args),
			include: {
				author: true,
			},
		})
		.then((story) => {
			if (story == null) return null;
			return omitStory(story);
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
