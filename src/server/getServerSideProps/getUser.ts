import { authConfig } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export type User = {
	email: string;
	userId: string;
};

export const getUser = async (
	context: GetServerSidePropsContext,
): Promise<User | null> => {
	const session = await getServerSession(context.req, context.res, authConfig);
	if (!session || !session.user?.email || !session.custom?.userId) {
		return null;
	}
	return {
		email: session.user.email,
		userId: session.custom.userId,
	};
};
