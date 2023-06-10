import { Layout } from "@/app/_layout";
import { Settings } from "@/features/settings";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { getUser } from "@/server/services/user";
import { notFound } from "next/navigation";

export default async function MyPage() {
	const session = await getUserSession();
	if (!session) {
		return notFound();
	}
	const user = await getUser({
		userId: session.userId,
	});
	if (!user) {
		console.error("user not found but session exists.");
		return notFound();
	}
	return (
		//@ts-expect-error
		<Layout>
			<Settings name={user.name} email={session.email} />
		</Layout>
	);
}
