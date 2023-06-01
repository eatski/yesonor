import { Layout } from "@/features/layout";
import { Landing } from "@/features/landing";
import { GetStaticProps } from "next";
import { Item, Stories } from "@/common/components/stories";
import { H2 } from "@/common/components/h2";
import { getStories } from "@/server/services/story";
import { revalidateTime } from "@/common/revalidate";
import { RecommendCreateStory } from "@/features/recommendCreateStory";

type Props = {
	stories: Item[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const stories = await getStories({
		count: 5,
	});
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

export default function Home(props: Props) {
	return (
		<>
			<Layout>
				<div style={{ marginBottom: "72px" }}>
					<Landing stories={props.stories} />
				</div>
				<div style={{ marginBottom: "24px" }}>
					<H2 label="新着ストーリー" />
					<Stories stories={props.stories} />
				</div>
				<RecommendCreateStory />
			</Layout>
		</>
	);
}
