import { Layout } from "@/components/layout";
import { Landing } from "@/components/landing";
import { GetStaticProps } from "next";
import { Item, StoryList } from "@/components/storyList";
import { H2 } from "@/designSystem/components/heading";
import { getStories } from "@/server/services/story";
import { revalidateTime } from "@/common/revalidate";
import { RecommendCreateStory } from "@/components/recommendCreateStory";
import { getStoriesRecommended } from "@/server/services/story/ranking";

type Props = {
	stories: Item[];
	recommend: Item[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const [stories, recommend] = await Promise.all([
		getStories({
			count: 5,
		}),
		getStoriesRecommended(),
	]);
	return {
		props: {
			stories: stories.map((story) => ({
				story,
				url: `/stories/${story.id}`,
			})),
			recommend: recommend.map((story) => ({
				story,
				url: `/stories/${story.id}`,
			})),
		},
		revalidate: revalidateTime.short,
	};
};

export default function Home({ stories, recommend }: Props) {
	return (
		<>
			<Layout>
				<div style={{ marginBottom: "72px" }}>
					<Landing stories={recommend} />
				</div>
				<section style={{ marginBottom: "24px" }}>
					<H2 label="おすすめストーリー" />
					<StoryList stories={recommend} />
				</section>
				<div style={{ marginBottom: "24px" }}>
					<RecommendCreateStory />
				</div>
				<section style={{ marginBottom: "24px" }}>
					<H2 label="新着ストーリー" />
					<StoryList stories={stories} seeMoreUrl={"/stories"} />
				</section>
			</Layout>
		</>
	);
}
