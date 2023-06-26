import { questionExample } from "@/server/model/schemas";
import { z } from "zod";
import { PrismaClient, Story as DbStory, User } from "@prisma/client";
import { Story, StoryHead } from "@/server/model/types";

export const hydrateStory = (story: DbStory): Story => {
	const { questionExamples, publishedAt, createdAt, ...rest } = story;
	return {
		...rest,
		publishedAt: publishedAt?.getTime() || null,
		questionExamples: z
			.array(questionExample)
			.parse(JSON.parse(story.questionExamples)),
	};
};

export const omitStory = (story: DbStory & { author?: User }): StoryHead => {
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
			name: author?.name || null,
		},
	};
};

export const createGetStoryWhere = (args: { storyId?: string }) => {
	return {
		id: args.storyId,
		published: true,
	};
};
