import { TrpcContextProvider } from "@/common/context/TrpcContextProvider";
import { Settings } from "@/components/settings";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { getUser } from "@/server/services/user";
import { notFound } from "next/navigation";
import { Layout } from "../../_components/layout";

export default async function MyPage() {
	const session = await getUserSession();

	if (!session) {
		notFound();
	}

	const user = await getUser({
		userId: session.userId,
	});

	if (!user) {
		console.error("user not found but session exists.");
		notFound();
	}

	return (
		<Layout>
			<TrpcContextProvider>
				<Settings name={user.name} email={session.email} />
			</TrpcContextProvider>
		</Layout>
	);
}
