import { Settings } from "@/components/settings";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { changeName } from "@/server/services/user/changeName";
import { deleteUser } from "@/server/services/user/deleteUser";
import { getUser } from "@/server/services/user/getUser";
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
		<Settings
			name={user.name}
			email={session.email}
			changeName={async (name) => {
				"use server";
				await changeName({
					userId: session.userId,
					name,
				});
			}}
			deleteUser={async () => {
				"use server";
				await deleteUser({
					userId: session.userId,
				});
			}}
		/>
	);
}
