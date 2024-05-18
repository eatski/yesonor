import { authConfig } from "@/pages/api/auth/[...nextauth]";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export type UserSession = {
	email: string;
	userId: string;
};

export const getUserSession = async (
	context: GetServerSidePropsContext,
): Promise<UserSession | null> => {
	const session = await getServerSession(context.req, context.res, authConfig);
	if (!session || !session.user?.email || !session.custom?.userId) {
		return null;
	}
	return {
		email: session.user.email,
		userId: session.custom.userId,
	};
};
