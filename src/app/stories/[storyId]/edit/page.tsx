import { getDevice } from "@/common/util/device";
import { EditStory } from "@/components/editStory";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { getStoryPrivate } from "@/server/services/story";
import { updateStory } from "@/server/services/story/updateStory";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { z } from "zod";

const paramsSchema = z.object({
	storyId: z.string(),
});

export default async function StoryEditPage({ params }: { params: unknown }) {
	const { storyId } = paramsSchema.parse(params);
	const user = await getUserSession();
	if (!user) {
		notFound();
	}
	const story = await getStoryPrivate({
		storyId,
		authorId: user.userId,
	});
	if (!story) {
		notFound();
	}
	const device = getDevice(headers().get("user-agent") || undefined);
	return (
		<EditStory
			story={story}
			storyId={storyId}
			device={device}
			onSubmit={async (input) => {
				"use server";
				await updateStory({
					storyId,
					input: input,
					userId: user.userId,
				});
				revalidateTag(`/stories/${storyId}`);
			}}
		/>
	);
}
