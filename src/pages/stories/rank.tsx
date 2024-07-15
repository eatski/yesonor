import { revalidateTime } from "@/common/revalidate";
import { Layout } from "@/components/layout";
import { type Item, StoryList } from "@/components/storyList";
import { H1 } from "@/designSystem/components/heading";
import { getStoriesRecommended } from "@/server/services/story/ranking";
import type { GetStaticProps } from "next";

type Props = {
	stories: Item[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const stories = await getStoriesRecommended(50);
	return {
		props: {
			stories: stories.map((story) => ({
				story,
				url: `/stories/${story.id}`,
			})),
		},
		revalidate: revalidateTime.short,
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
