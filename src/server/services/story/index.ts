import { questionExample } from "@/server/model/schemas";
import { Story, StoryHead } from "@/server/model/types";
import { PrismaClient, Story as DbStory } from "@prisma/client";
import { z } from "zod";

const hydrateStory = (story: DbStory): Story => {
	const { questionExamples, authorEmail, publishedAt, createdAt, ...rest } =
		story;
	return {
		...rest,
		publishedAt: publishedAt?.getTime() || null,
		questionExamples: z
			.array(questionExample)
			.parse(JSON.parse(story.questionExamples)),
	};
};

const omitStory = (story: DbStory): StoryHead => {
	const {
		questionExamples,
		authorEmail,
		truth,
		simpleTruth,
		publishedAt,
		createdAt,
		...rest
	} = story;
	return {
		...rest,
		publishedAt: publishedAt?.getTime() || null,
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
		})
		.then((stories) => stories.map(omitStory));
};

const getStoryInner = (args: { storyId: string }): Promise<DbStory | null> => {
	const prisma = new PrismaClient();
	return prisma.story.findFirst({
		where: {
			id: args.storyId,
			published: true,
		},
	});
};

export const getStory = (args: { storyId: string }): Promise<Story | null> => {
	return getStoryInner(args).then((story) => {
		if (story == null) return null;
		return hydrateStory(story);
	});
};

export const getStoryHead = (args: {
	storyId: string;
}): Promise<StoryHead | null> => {
	return getStoryInner(args).then((story) => {
		if (story == null) return null;
		return omitStory(story);
	});
};

const getStoryPrivateInner = (args: {
	storyId: string;
	autherEmail: string;
}): Promise<DbStory | null> => {
	const prisma = new PrismaClient();
	return prisma.story.findFirst({
		where: {
			OR: [
				{
					id: args.storyId,
					authorEmail: args.autherEmail,
				},
				{
					id: args.storyId,
					published: true,
				},
			],
		},
	});
};

export const getStoryPrivate = async (args: {
	storyId: string;
	autherEmail: string;
}): Promise<Story | null> => {
	const prisma = new PrismaClient();
	return getStoryPrivateInner(args).then((story) => {
		if (story == null) return null;
		return hydrateStory(story);
	});
};

export const getStoryHeadPrivate = async (args: {
	storyId: string;
	autherEmail: string;
}): Promise<StoryHead | null> => {
	return getStoryPrivateInner(args).then((story) => {
		if (story == null) return null;
		return omitStory(story);
	});
};

export const getStoriesPrivate = async (args: { autherEmail: string }): Promise<
	StoryHead[]
> => {
	const prisma = new PrismaClient();
	return prisma.story
		.findMany({
			where: {
				authorEmail: args.autherEmail,
			},
			orderBy: [
				{
					publishedAt: "desc",
				},
				{
					createdAt: "desc",
				},
			],
		})
		.then((stories) => stories.map(omitStory));
};
