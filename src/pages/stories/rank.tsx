import { Layout } from "@/features/layout";
import { GetStaticProps } from "next";
import { Item, Stories } from "@/common/components/stories";
import { H2 } from "@/common/components/h2";
import { revalidateTime } from "@/common/revalidate";
import { getStoriesRecommended } from "@/server/services/story/ranking";

type Props = {
	stories: Item[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const stories = await getStoriesRecommended();
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
			<H2 label="おすすめストーリー" />
			<Stories stories={props.stories} />
		</Layout>
	);
}
