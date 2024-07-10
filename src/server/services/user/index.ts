import { prisma } from "@/libs/prisma";
import { setTimeout } from "timers/promises";

export type User = {
	id: string;
	name: string | null;
};

export const getUser = async ({ userId }: { userId: string }) => {
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
};
