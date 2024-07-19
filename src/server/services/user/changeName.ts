import { prisma } from "@/libs/prisma";
import { revalidateTag } from "next/cache";

export const changeName = async ({
	userId,
	name,
}: { userId: string; name: string }) => {
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			name: name,
		},
	});
	revalidateTag(`/users/${userId}`);
};
