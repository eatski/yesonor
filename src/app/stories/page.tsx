import { revalidateTime } from "@/common/revalidate";
import { StoryList } from "@/components/storyList";
import { H2 } from "@/designSystem/components/heading";
import { getStories } from "@/server/services/story";
import { Layout } from "../_components/layout";

export const revalidate = revalidateTime.short;

const NewerStories = async () => {
	const stories = await getStories({
		count: 100,
	});
	return (
		<Layout>
			<H2 label="全てのストーリー" />
			<StoryList
				stories={stories.map((story) => ({
					story,
					url: `/stories/${story.id}`,
				}))}
			/>
		</Layout>
	);
};

export default NewerStories;
