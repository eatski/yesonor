import { prisma } from "@/libs/prisma";
import type { Story, StoryHead } from "@/server/model/story";
import { PrismaClient } from "@prisma/client";
import {
	createGetStoryPrivateWhere,
	createGetStoryWhere,
	hydrateStory,
	omitStory,
} from "./functions";

export const getStories = (args: { count: number }): Promise<StoryHead[]> => {
	const prisma = new PrismaClient();
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
};

export const getStory = (args: { storyId: string }): Promise<Story | null> => {
	return prisma.story
		.findFirst({
			where: createGetStoryWhere(args),
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

export const getStoriesPrivate = async (args: { authorId: string }): Promise<
	StoryHead[]
> => {
	const prisma = new PrismaClient();
	return prisma.story
		.findMany({
			where: {
				authorId: args.authorId,
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
