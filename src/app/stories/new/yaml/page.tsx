import { NewStoryYaml } from "@/components/newStoryYaml";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { createStory } from "@/server/services/story/createStory";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function NewStoryPage() {
	const session = await getUserSession();
	if (!session) {
		redirect(
			`/api/auth/signin?callbackUrl=${encodeURIComponent("/stories/new")}`,
			RedirectType.replace,
		);
	}
	return (
		<NewStoryYaml
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
