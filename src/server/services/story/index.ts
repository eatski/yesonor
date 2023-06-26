import { prisma } from "@/libs/prisma";
import { Story, StoryHead } from "@/server/model/types";
import { PrismaClient } from "@prisma/client";
import { createGetStoryWhere, hydrateStory, omitStory } from "./functions";

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

const createGetStoryPrivateWhere = (args: {
	storyId: string;
	authorId: string;
}) => {
	return {
		OR: [
			{
				id: args.storyId,
				authorId: args.authorId,
			},
			{
				id: args.storyId,
				published: true,
			},
		],
	};
};

export const getStoryPrivate = async (args: {
	storyId: string;
	authorId: string;
}): Promise<Story | null> => {
	return prisma.story
		.findFirst({
			where: createGetStoryPrivateWhere(args),
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
