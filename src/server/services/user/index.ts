import { prisma } from "@/libs/prisma";

export type User = {
	id: string;
	name: string | null;
};

export const getUser = ({ userId }: { userId: string }) => {
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
