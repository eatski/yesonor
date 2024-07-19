import { prisma } from "@/libs/prisma";

export const deleteStory = async (args: {
	storyId: string;
	userId: string;
}) => {
	const { count } = await prisma.story.deleteMany({
		where: {
			id: args.storyId,
			authorId: args.userId,
		},
	});
	if (count === 0) {
		return "NOT_FOUND";
	}
	return "OK";
};
