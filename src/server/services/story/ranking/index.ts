import { prisma } from "@/libs/prisma";
import { createGetStoryWhere, hydrateStory, omitStory } from "../functions";
import { StoryHead } from "@/server/model/story";

const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_MONTH = ONE_DAY * 30;

export const getStoriesRecommended = async (): Promise<StoryHead[]> => {
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
						gte: new Date(now - ONE_MONTH * 6),
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
		take: 50,
	});
	const scoredStories = stories.map((story) => {
		const { questionLogs, evaluations, solutionLogs, ...rest } = story;
		const hydreted = hydrateStory(rest);
		const omitted = omitStory(rest);
		const correctSolutionsLength = solutionLogs.length;
		const questionLogsLength = questionLogs.length;
		const bunned = evaluations.some((e) => e.rating === 0);
		const avg =
			evaluations.reduce((acc, e) => acc + e.rating, 0) / evaluations.length;
		const questionExamplesLength = hydreted.questionExamples.length;
		const random = Math.random();
		const timeFromPublished =
			(story.publishedAt ? now - story.publishedAt.getTime() : 0) + ONE_DAY;

		const score = !bunned
			? ((correctSolutionsLength + 1) *
					(avg + 1) *
					(questionLogsLength + 100) *
					(questionExamplesLength + 10) *
					Math.pow(random, 2)) /
			  Math.pow(timeFromPublished, 0.5)
			: 0;
		return {
			story: omitted,
			score,
		};
	});
	scoredStories.sort((a, b) => b.score - a.score);
	return scoredStories.map((e) => e.story).slice(0, 8);
};
