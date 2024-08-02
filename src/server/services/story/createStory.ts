import { generateId } from "@/common/util/id";
import { prisma } from "@/libs/prisma";
import { StoryInit, storyInit } from "@/server/model/story";

export const createStory = async ({
	userId,
	data,
}: { userId: string; data: StoryInit }) => {
	const validate = storyInit.safeParse(data);
	if (validate.error) {
		console.warn(validate.error.message);
		return null;
	}
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
