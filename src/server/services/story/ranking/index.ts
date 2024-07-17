import { revalidateTime } from "@/common/revalidate";
import { CURRENT_HOUR_SEED } from "@/common/util/currentDateSeed";
import { prisma } from "@/libs/prisma";
import type { StoryHead } from "@/server/model/story";
import { nextCache } from "@/server/serverComponent/nextCache";
import { get } from "@vercel/edge-config";
import seedrandam from "seedrandom";
import { z } from "zod";
import { createGetStoryWhere, hydrateStory, omitStory } from "../functions";

const rankingWeightSchema = z.object({
	questionLogsLength: z.number(),
	correctSolutionsLength: z.number(),
	evaluationTotal: z.number(),
	questionExamplesLength: z.number(),
	random: z.number(),
	timeFromPublished: z.number(),
});

const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_MONTH = ONE_DAY * 30;

const findStoriesToRank = nextCache(
	async () => {
		const now = Date.now();
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
		return stories.map((story) => {
			return {
				omitted: omitStory(story),
				hydrated: hydrateStory(story),
				original: story,
			};
		});
	},
	["findStoriesToRank"],
	{
		revalidate: revalidateTime.medium,
	},
);

export const getStoriesRecommended = nextCache(
	async (
		count: number,
		seed: string = CURRENT_HOUR_SEED,
	): Promise<StoryHead[]> => {
		const now = Date.now();
		// すべてのストーリーを取得
		const [stories, weight] = await Promise.all([
			findStoriesToRank(),
			get("rankingWeight").then(rankingWeightSchema.parse),
		]);
		const rng = seedrandam(seed);
		const scoredStories = stories
			.filter(({ original }) =>
				original.evaluations.every((e) => e.rating !== 0),
			)
			.map((story) => {
				const { hydrated, omitted, original } = story;
				const { questionLogs, evaluations, solutionLogs, ...rest } = original;

				const correctSolutionsLength = solutionLogs.length;
				const questionLogsLength = questionLogs.length;
				const total = evaluations.reduce((acc, e) => acc + e.rating - 3, 0);
				const questionExamplesLength = hydrated.questionExamples.length;
				const timeFromPublished =
					(rest.publishedAt ? now - new Date(rest.publishedAt).getTime() : 0) +
					ONE_DAY;

				const source = [
					[correctSolutionsLength, 1, weight.correctSolutionsLength],
					[total, 1, weight.evaluationTotal],
					[questionLogsLength, 1, weight.questionLogsLength],
					[questionExamplesLength, 1, weight.questionExamplesLength],
					[rng(), 0, weight.random],
					[timeFromPublished, 1, weight.timeFromPublished],
				] as const;

				const score = source.reduce(
					(acc, [value, min, weight]) => acc * Math.max(value, min) ** weight,
					1,
				);

				return {
					story: omitted,
					score,
				};
			});
		scoredStories.sort((a, b) => b.score - a.score);
		return scoredStories.map((e) => e.story).slice(0, count);
	},
	["getStoriesRecommended"],
	{
		revalidate: revalidateTime.medium,
	},
);
