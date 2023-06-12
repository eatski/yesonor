import { Loading } from "@/app/_components/loading";
import { MainContent } from "@/app/_components/main";
import { Settings } from "@/features/settings";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { getUser } from "@/server/services/user";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function MyPage() {
	return (
		<MainContent>
			<Suspense fallback={<Loading />}>
				{/* @ts-expect-error */}
				<AsyncMyPage />
			</Suspense>
		</MainContent>
	);
}

const AsyncMyPage = async () => {
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
	return <Settings name={user.name} email={session.email} />;
};
