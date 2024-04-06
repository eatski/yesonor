import {
	QuestionExample,
	questionExample,
	Story,
	StoryHead,
	StoryWithQuestionLogs,
} from "@/server/model/story";
import { z } from "zod";
import { Story as DbStory, User, QuestionLog } from "@prisma/client";

const hydrateQuestionExamples = (
	stringQuestionExamples: string,
): QuestionExample[] => {
	return z.array(questionExample).parse(JSON.parse(stringQuestionExamples));
};

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
		questionExamples: hydrateQuestionExamples(questionExamples),
	};
};

export const hydrateStoryWithQuestionLogs = (
	story: DbStory & {
		questionLogs: QuestionLog[];
		author: User;
	},
): StoryWithQuestionLogs => {
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
		questionExamples: hydrateQuestionExamples(questionExamples),
		questionLogs: story.questionLogs,
		author: {
			id: author.id,
			name: author.name,
		},
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

export const createGetStoryPrivateWhere = (args: {
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
