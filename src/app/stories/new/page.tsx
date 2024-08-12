import { getDevice } from "@/server/serverComponent/getDevice";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { createStory } from "@/server/services/story/createStory";
import { Metadata } from "next";
import { RedirectType, notFound, redirect } from "next/navigation";
import { NewStorySwitchMode } from "./_components/NewStorySwitchMode";

export const metadata: Metadata = {
	title: "新しいストーリー",
};

export default async function NewStoryPage() {
	const session = await getUserSession();
	if (!session) {
		redirect(
			`/api/auth/signin?callbackUrl=${encodeURIComponent("/stories/new")}`,
			RedirectType.replace,
		);
	}
	const device = getDevice();
	return (
		<NewStorySwitchMode
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
