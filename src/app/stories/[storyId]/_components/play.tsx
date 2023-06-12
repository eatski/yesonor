import { StoryDescription } from "@/features/storyDescription";
import { getStoryHead } from "@/server/services/story";
import { notFound } from "next/navigation";

export const ServerStoryDescription = async ({
	storyId,
}: { storyId: string }) => {
	const story = await getStoryHead({
		storyId: storyId,
	});
	if (!story) {
		notFound();
	}
	return <StoryDescription story={story} />;
};
