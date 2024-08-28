import { revalidateTime } from "@/common/revalidate";
import { StoryList } from "@/components/storyList";
import { Heading } from "@/designSystem/components/heading";
import { getStories } from "@/server/services/story/getStories";
import styles from "./page.module.scss";

export const revalidate = revalidateTime.short;

const NewerStories = async () => {
	const stories = await getStories({
		count: 300,
	});
	return (
		<div className={styles.container}>
			<Heading level={1}>全てのストーリー</Heading>
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

export default NewerStories;
