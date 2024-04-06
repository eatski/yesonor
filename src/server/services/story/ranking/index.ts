import { prisma } from "@/libs/prisma";
import { createGetStoryWhere, hydrateStory, omitStory } from "../functions";
import { StoryHead } from "@/server/model/story";

const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_MONTH = ONE_DAY * 30;

export const getStoriesRecommended = async (
	count: number,
): Promise<StoryHead[]> => {
	const now = Date.now();
	// すべてのストーリーを取得
	const stories = await prisma.story.findMany({
		include: {
			evaluations: true,
			questionLogs: {
				where: {
					createdAt: {
						gte: new Date(now - ONE_MONTH),
					},
				},
			},
			solutionLogs: {
				where: {
					createdAt: {
						gte: new Date(now - ONE_MONTH * 3),
					},
					result: "Correct",
				},
			},
			author: true,
		},
		where: createGetStoryWhere({}),
		orderBy: {
			publishedAt: "desc",
		},
		take: 100,
	});
	const scoredStories = stories
		.filter((story) => story.evaluations.every((e) => e.rating !== 0))
		.map((story) => {
			const { questionLogs, evaluations, solutionLogs, ...rest } = story;
			const hydreted = hydrateStory(rest);
			const omitted = omitStory(rest);
			const correctSolutionsLength = solutionLogs.length;
			const questionLogsLength = questionLogs.length;
			const avg = evaluations.length
				? evaluations.reduce((acc, e) => acc + e.rating - 2.5, 0) /
				  evaluations.length
				: 0;
			const questionExamplesLength = hydreted.questionExamples.length;
			const random = Math.random();
			const timeFromPublished =
				(story.publishedAt ? now - story.publishedAt.getTime() : 0) + ONE_DAY;

			const score =
				((Math.pow(correctSolutionsLength, 2) + 1) *
					(avg + 2.5) *
					(Math.pow(questionLogsLength, 2) + 100) *
					(questionExamplesLength + 10) *
					Math.pow(random, 1.5)) /
				Math.pow(timeFromPublished, 0.5);

			return {
				story: omitted,
				score,
			};
		});
	scoredStories.sort((a, b) => b.score - a.score);
	return scoredStories.map((e) => e.story).slice(0, count);
};
