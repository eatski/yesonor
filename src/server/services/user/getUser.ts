import { prisma } from "@/libs/prisma";
import { nextCache } from "@/server/serverComponent/nextCache";

export type User = {
	id: string;
	name: string | null;
};

export const getUser = async ({ userId }: { userId: string }) => {
	return nextCache(
		() => {
			return prisma.user
				.findUnique({
					where: {
						id: userId,
					},
				})
				.then<User | null>((user) =>
					user
						? {
								id: user.id,
								name: user.name,
							}
						: null,
				);
		},
		["getUser", userId],
		{
			tags: [`/users/${userId}`],
		},
	)();
};
