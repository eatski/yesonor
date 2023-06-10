import { authConfig } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export type UserSession = {
	email: string;
	userId: string;
};

export const getUserSession = async (): Promise<UserSession | null> => {
	const session = await getServerSession(authConfig);
	console.log("session", session);
	if (!session || !session.user?.email || !session.custom?.userId) {
		return null;
	}
	return {
		email: session.user.email,
		userId: session.custom.userId,
	};
};
