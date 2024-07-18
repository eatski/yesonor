import { generateId } from "@/common/util/id";
import { prisma } from "@/libs/prisma";
import { StoryInit } from "@/server/model/story";

export const createStory = async ({
	userId,
	data,
}: { userId: string; data: StoryInit }) => {
	const { questionExamples, ...storyData } = data;
	const story = await prisma.story.create({
		data: {
			...storyData,
			id: generateId(),
			questionExamples: JSON.stringify(questionExamples),
			authorId: userId,
		},
	});
	return story.id;
};
