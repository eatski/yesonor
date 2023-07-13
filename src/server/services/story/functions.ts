import { questionExample, Story, StoryHead } from "@/server/model/story";
import { z } from "zod";
import { Story as DbStory, User } from "@prisma/client";

export const hydrateStory = (
	story: DbStory & {
		author: User;
	},
): Story => {
	const {
		questionExamples,
		publishedAt,
		createdAt,
		author,
		authorId,
		...rest
	} = story;
	return {
		...rest,
		publishedAt: publishedAt?.getTime() || null,
		author: {
			id: author.id,
			name: author.name,
		},
		questionExamples: z
			.array(questionExample)
			.parse(JSON.parse(story.questionExamples)),
	};
};

export const omitStory = (story: DbStory & { author: User }): StoryHead => {
	const {
		questionExamples,
		truth,
		simpleTruth,
		publishedAt,
		createdAt,
		author,
		authorId,
		...rest
	} = story;
	return {
		...rest,
		publishedAt: publishedAt?.getTime() || null,
		author: {
			id: author.id,
			name: author.name || null,
		},
	};
};

export const createGetStoryWhere = (args: { storyId?: string }) => {
	return {
		id: args.storyId,
		published: true,
	};
};
