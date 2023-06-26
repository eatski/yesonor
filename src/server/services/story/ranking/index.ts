import { prisma } from "@/libs/prisma";
import { createGetStoryWhere, hydrateStory, omitStory } from "../functions";
import { Story, StoryHead } from "@/server/model/types";

export const getStoriesRecommended = async (): Promise<StoryHead[]> => {
	// すべてのストーリーを取得
	const stories = await prisma.story.findMany({
		include: {
			questionLogs: true,
			solutionLogs: true,
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
		const score =
			solutionLogs.filter((e) => e.result === "Correct").length * 16 +
			solutionLogs.filter((e) => e.result === "Incorrect").length * 1 +
			questionLogs.length * 1 +
			hydreted.questionExamples.length * 1;
		return {
			story: omitted,
			score,
		};
	});
	scoredStories.sort((a, b) => b.score - a.score);
	return scoredStories.map((e) => e.story).slice(0, 5);
};
