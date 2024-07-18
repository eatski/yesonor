import { prisma } from "@/libs/prisma";

export const postStoryEvalution = async ({
	storyId,
	userId,
}: {
	storyId: string;
	userId: string;
}) => {
	const init = {
		storyId: storyId,
		rating: 4,
		userId: userId,
	};
	const data = await prisma.storyEvaluation.upsert({
		create: init,
		update: init,
		where: {
			storyId_userId: {
				storyId: storyId,
				userId: userId,
			},
		},
	});
	return data.id;
};
