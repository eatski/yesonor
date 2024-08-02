import { revalidateTime } from "@/common/revalidate";
import { StoryList } from "@/components/storyList";
import { Heading } from "@/designSystem/components/heading";
import { getStoriesRecommended } from "@/server/services/story/ranking";
import styles from "./page.module.scss";

export const revalidate = revalidateTime.medium;

const RankStories = async () => {
	const stories = await getStoriesRecommended(50);
	return (
		<div className={styles.container}>
			<Heading level={1}>おすすめストーリー</Heading>
			<StoryList
				stories={stories.map((story) => ({
					story,
					url: `/stories/${story.id}`,
				}))}
				level={2}
			/>
		</div>
	);
};

export default RankStories;
