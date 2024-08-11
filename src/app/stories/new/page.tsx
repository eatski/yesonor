import { getDevice } from "@/common/util/device";
import { NewStory } from "@/components/newStory";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { createStory } from "@/server/services/story/createStory";
import { headers } from "next/headers";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function NewStoryPage() {
	const session = await getUserSession();
	if (!session) {
		redirect(
			`/api/auth/signin?callbackUrl=${encodeURIComponent("/stories/new")}`,
			RedirectType.replace,
		);
	}
	const device = getDevice(headers().get("user-agent") || undefined);
	return (
		<NewStory
			device={device}
			createStory={async (data) => {
				"use server";
				const id = await createStory({
					userId: session.userId,
					data,
				});
				if (id === null) {
					notFound();
				}
				return id;
			}}
		/>
	);
}
