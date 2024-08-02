import { prisma } from "@/libs/prisma";
import { storyInit } from "@/server/model/story";
import { z } from "zod";

type Input = z.infer<typeof storyInit>;

export const updateStory = async ({
	storyId,
	input,
	userId,
}: { storyId: string; input: Input; userId: string }) => {
	const validate = storyInit.safeParse(input);
	if (validate.error) {
		console.warn(validate.error.message);
		return false;
	}
	const { questionExamples, ...storyData } = input;

	await prisma.story.updateMany({
		where: {
			id: storyId,
			authorId: userId,
		},
		data: {
			...storyData,
			questionExamples: JSON.stringify(questionExamples),
		},
	});
	return true;
};
