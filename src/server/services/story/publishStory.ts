import { prisma } from "@/libs/prisma";

export const publishStoryAtFirst = async (args: {
	storyId: string;
	userId: string;
}) => {
	const { count } = await prisma.story.updateMany({
		where: {
			id: args.storyId,
			authorId: args.userId,
			published: false,
			publishedAt: null,
		},
		data: {
			published: true,
			publishedAt: new Date(),
		},
	});
	if (count === 0) {
		return "NOT_FOUND";
	}
	return "OK";
};
