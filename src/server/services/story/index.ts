import { prisma } from "@/libs/prisma";
import { questionExample } from "@/server/model/schemas";
import { Story, StoryHead } from "@/server/model/types";
import { PrismaClient, Story as DbStory, User } from "@prisma/client";
import { z } from "zod";

const hydrateStory = (story: DbStory): Story => {
	const { questionExamples, publishedAt, createdAt, ...rest } = story;
	return {
		...rest,
		publishedAt: publishedAt?.getTime() || null,
		questionExamples: z
			.array(questionExample)
			.parse(JSON.parse(story.questionExamples)),
	};
};

const omitStory = (story: DbStory & { author: User }): StoryHead => {
	const {
		questionExamples,
		truth,
		simpleTruth,
		publishedAt,
		createdAt,
		author,
		...rest
	} = story;
	return {
		...rest,
		publishedAt: publishedAt?.getTime() || null,
		author: {
			name: author.name,
		},
	};
};

export const getStories = (args: { count: number }): Promise<StoryHead[]> => {
	const prisma = new PrismaClient();
	return prisma.story
		.findMany({
			take: args.count,
			where: {
				published: true,
			},
			orderBy: {
				publishedAt: "desc",
			},
			include: {
				author: true,
			},
		})
		.then((stories) => stories.map(omitStory));
};

const createGetStoryWhere = (args: { storyId: string }) => {
	return {
		id: args.storyId,
		published: true,
	};
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
