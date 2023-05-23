import { questionExample } from "@/server/model/schemas";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

export const getStories = (args: { count: number }) => {
	const prisma = new PrismaClient();
	return prisma.story.findMany({
		take: args.count,
		where: {
			published: true,
		},
		orderBy: {
			publishedAt: "desc",
		},
	});
};

export const getStory = (args: { storyId: string }) => {
	const prisma = new PrismaClient();
	return prisma.story
		.findFirst({
			where: {
				id: args.storyId,
				published: true,
			},
		})
		.then((story) => {
			if (story == null) return null;
			const { questionExamples, ...rest } = story;
			return {
				...rest,
				questionExamples: z
					.array(questionExample)
					.parse(JSON.parse(story.questionExamples)),
			};
		});
};

export const getStoryPrivate = async (args: {
	storyId: string;
	autherEmail: string;
}) => {
	const prisma = new PrismaClient();
	return prisma.story
		.findFirst({
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
		})
		.then((story) => {
			if (story == null) return null;
			const { questionExamples, ...rest } = story;
			return {
				...rest,
				questionExamples: z
					.array(questionExample)
					.parse(JSON.parse(story.questionExamples)),
			};
		});
};

export const getStoriesPrivate = async (args: { autherEmail: string }) => {
	const prisma = new PrismaClient();
	return prisma.story.findMany({
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
	});
};
