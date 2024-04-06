import { Layout } from "@/components/layout";
import { GetStaticProps } from "next";
import { Item, StoryList } from "@/components/storyList";
import { H1 } from "@/designSystem/components/heading";
import { revalidateTime } from "@/common/revalidate";
import { getStoriesRecommended } from "@/server/services/story/ranking";

type Props = {
	stories: Item[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const stories = await getStoriesRecommended(20);
	return {
		props: {
			stories: stories.map((story) => ({
				story,
				url: `/stories/${story.id}`,
			})),
		},
		revalidate: revalidateTime.medium,
	};
};

export default function Story(props: Props) {
	return (
		<Layout>
			<main>
				<H1>おすすめストーリー</H1>
				<StoryList stories={props.stories} />
			</main>
		</Layout>
	);
}
