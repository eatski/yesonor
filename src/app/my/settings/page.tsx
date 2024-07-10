import { TrpcContextProvider } from "@/common/context/TrpcContextProvider";
import { Settings } from "@/components/settings";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { getUser } from "@/server/services/user";
import { notFound } from "next/navigation";

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
		<TrpcContextProvider>
			<Settings name={user.name} email={session.email} />
		</TrpcContextProvider>
	);
}
