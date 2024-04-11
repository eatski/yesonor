import { prisma } from "@/libs/prisma";
import { createGetStoryWhere, hydrateStory, omitStory } from "../functions";
import { StoryHead } from "@/server/model/story";
import { CURRENT_HOUR_SEED } from "@/common/util/currentDateSeed";
import seedrandam from "seedrandom";

const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_MONTH = ONE_DAY * 30;

export const getStoriesRecommended = async (
	count: number,
	seed: string = CURRENT_HOUR_SEED,
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
	const rng = seedrandam(seed);
	const scoredStories = stories
		.filter((story) => story.evaluations.every((e) => e.rating !== 0))
		.map((story) => {
			const { questionLogs, evaluations, solutionLogs, ...rest } = story;
			const hydreted = hydrateStory(rest);
			const omitted = omitStory(rest);
			const correctSolutionsLength = solutionLogs.length;
			const questionLogsLength = questionLogs.length;
			const total = evaluations.reduce((acc, e) => acc + e.rating - 3, 0);
			const questionExamplesLength = hydreted.questionExamples.length;
			const timeFromPublished =
				(story.publishedAt ? now - story.publishedAt.getTime() : 0) + ONE_DAY;

			const score =
				(Math.pow(Math.max(correctSolutionsLength, 1), 0.3) *
					Math.pow(Math.max(total, 1), 0.9) *
					Math.pow(Math.max(questionLogsLength, 1), -0.1) *
					Math.pow(questionExamplesLength + 1, 0.3) *
					Math.pow(rng(), 2.2)) /
				Math.pow(timeFromPublished, 0.5);

			return {
				story: omitted,
				score,
			};
		});
	scoredStories.sort((a, b) => b.score - a.score);
	return scoredStories.map((e) => e.story).slice(0, count);
};
