import { prisma } from "@/libs/prisma";

export const publishStory = async (args: {
	storyId: string;
	userId: string;
	atFirst: boolean;
}): Promise<"OK" | "NOT_FOUND"> => {
	if (args.atFirst) {
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
	} else {
		const { count } = await prisma.story.updateMany({
			where: {
				id: args.storyId,
				authorId: args.userId,
				published: false,
			},
			data: {
				published: true,
			},
		});
		if (count === 0) {
			return "NOT_FOUND";
		}
		return "OK";
	}
};

export const unpublishStory = async (args: {
	storyId: string;
	userId: string;
}) => {
	const { count } = await prisma.story.updateMany({
		where: {
			id: args.storyId,
			authorId: args.userId,
			published: true,
		},
		data: {
			published: false,
		},
	});
	if (count === 0) {
		return "NOT_FOUND";
	}
	return "OK";
};
