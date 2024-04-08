import { prisma } from "@/libs/prisma";

export const refineQuestionLogs = async () => {
	return prisma
		.$transaction(async (prisma) => {
			const stories = await prisma.story.findMany({
				include: {
					questionLogs: {
						select: {
							id: true,
						},
						orderBy: {
							// 新しい順
							createdAt: "desc",
						},
						take: 500,
					},
				},
				orderBy: {
					questionLogs: {
						_count: "desc",
					},
				},
				take: 3,
			});
			// logのidをまとめる
			const logIdsToRemain = stories.reduce<string[]>((acc, story) => {
				return acc.concat(story.questionLogs.map((log) => log.id));
			}, []);

			const logIdToDelete = await prisma.questionLog.findMany({
				where: {
					id: {
						notIn: logIdsToRemain,
					},
				},
				select: {
					id: true,
				},
				take: 2000,
			});

			return prisma.questionLog.deleteMany({
				where: {
					id: {
						in: logIdToDelete.map((log) => log.id),
					},
				},
			});
		})
		.then((result) => result.count);
};
