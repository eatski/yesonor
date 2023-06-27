import { Layout } from "@/features/layout";
import { Landing } from "@/features/landing";
import { GetStaticProps } from "next";
import { Item, Stories } from "@/common/components/stories";
import { H2 } from "@/common/components/h2";
import { getStories } from "@/server/services/story";
import { revalidateTime } from "@/common/revalidate";
import { RecommendCreateStory } from "@/features/recommendCreateStory";
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
				<div style={{ marginBottom: "24px" }}>
					<H2 label="おすすめストーリー" />
					<Stories stories={recommend} />
				</div>
				<div style={{ marginBottom: "24px" }}>
					<H2 label="新着ストーリー" />
					<Stories stories={stories} seeMoreUrl={"/stories"} />
				</div>
				<div style={{ marginBottom: "24px" }}>
					<RecommendCreateStory />
				</div>
			</Layout>
		</>
	);
}
