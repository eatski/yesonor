import { StoryDescription } from "@/features/storyDescription";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { getStoryHeadPrivate } from "@/server/services/story";
import { notFound } from "next/navigation";

export const ServerStoryDescription = async ({
	storyId,
}: { storyId: string }) => {
	const session = await getUserSession();
	if (!session) {
		notFound();
	}
	const story = await getStoryHeadPrivate({
		storyId: storyId,
		authorId: session.userId,
	});
	if (!story) {
		notFound();
	}
	return <StoryDescription story={story} />;
};
