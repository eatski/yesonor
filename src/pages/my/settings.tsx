import { Layout } from "@/components/layout";
import { Settings } from "@/components/settings";
import {
	type UserSession,
	getUserSession,
} from "@/server/getServerSideProps/getUserSession";
import { type User, getUser } from "@/server/services/user";
import type { GetServerSideProps } from "next";

type Props = {
	session: UserSession;
	user: User;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const session = await getUserSession(ctx);
	if (!session) {
		return {
			notFound: true,
		};
	}
	const user = await getUser({
		userId: session.userId,
	});
	if (!user) {
		console.error("user not found but session exists.");
		return {
			notFound: true,
		};
	}

	return {
		props: {
			session: session,
			user: user,
		},
	};
};

export default function MyPage(props: Props) {
	return (
		<Layout>
			<Settings name={props.user.name} email={props.session.email} />
		</Layout>
	);
}
