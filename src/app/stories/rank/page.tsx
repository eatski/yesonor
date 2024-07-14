import { revalidateTime } from "@/common/revalidate";
import { StoryList } from "@/components/storyList";
import { H2 } from "@/designSystem/components/heading";
import { getStoriesRecommended } from "@/server/services/story/ranking";

export const revalidate = revalidateTime.short;

const RankStories = async () => {
	const stories = await getStoriesRecommended(50);
	return (
		<>
			<H2 label="おすすめストーリー" />
			<StoryList
				stories={stories.map((story) => ({
					story,
					url: `/stories/${story.id}`,
				}))}
			/>
		</>
	);
};

export default RankStories;
