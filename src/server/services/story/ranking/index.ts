import { prisma } from "@/libs/prisma";
import { createGetStoryWhere, hydrateStory, omitStory } from "../functions";
import { StoryHead } from "@/server/model/story";

const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;

export const getStoriesRecommended = async (): Promise<StoryHead[]> => {
	// すべてのストーリーを取得
	const stories = await prisma.story.findMany({
		include: {
			questionLogs: {
				where: {
					createdAt: {
						gte: new Date(Date.now() - ONE_MONTH),
					},
				},
			},
			solutionLogs: {
				where: {
					createdAt: {
						gte: new Date(Date.now() - ONE_MONTH),
					},
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
		const { questionLogs, solutionLogs, ...rest } = story;
		const hydreted = hydrateStory(rest);
		const omitted = omitStory(rest);
		const correctSolutionsLength = solutionLogs.filter(
			(e) => e.result === "Correct",
		).length;
		const incorrectSolutionsLength = solutionLogs.filter(
			(e) => e.result === "Incorrect",
		).length;
		const questionLogsLength = questionLogs.length;
		const questionExamplesLength = hydreted.questionExamples.length;

		const score =
			(correctSolutionsLength + 1) *
			(questionLogsLength + incorrectSolutionsLength + 10) *
			(questionExamplesLength + 10);
		return {
			story: omitted,
			score,
		};
	});
	scoredStories.sort((a, b) => b.score - a.score);
	return scoredStories.map((e) => e.story).slice(0, 5);
};
