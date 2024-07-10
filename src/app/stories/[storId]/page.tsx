import { TrpcContextProvider } from "@/common/context/TrpcContextProvider";
import { HeadMetaOverride } from "@/components/headMeta";
import { Play } from "@/components/play";
import { StoryDescription } from "@/components/storyDescription";
import { Toast } from "@/components/toast";
import type { Story } from "@/server/model/story";
import { getStories, getStory } from "@/server/services/story";
import { notFound } from "next/navigation";

type Props = {
	storyId: string;
};

export const generateStaticParams = async () => {
	const stories = await getStories({
		count: 100,
	});
	return stories.map(({ id }) => ({
		storyId: id.toString(),
	}));
};

export default async function Story({ storyId }: Props) {
	const story = await getStory({
		storyId: storyId,
	});
	if (!story) {
		return notFound();
	}
	return (
		<>
			<HeadMetaOverride
				titleHeadOverride={story.title}
				descriptionOverride={story.quiz}
			/>
			<Toast>
				<StoryDescription story={story} />
			</Toast>
			<TrpcContextProvider>
				<Play story={story} />
			</TrpcContextProvider>
		</>
	);
}
