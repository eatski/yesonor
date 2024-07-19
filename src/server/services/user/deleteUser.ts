import { prisma } from "@/libs/prisma";
import { revalidateTag } from "next/cache";

export const deleteUser = async ({ userId }: { userId: string }) => {
	await prisma.user.delete({
		where: {
			id: userId,
		},
	});
	revalidateTag(`/users/${userId}`);
};
