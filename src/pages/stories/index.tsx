import { revalidateTime } from "@/common/revalidate";
import { Layout } from "@/components/layout";
import { type Item, StoryList } from "@/components/storyList";
import { H2 } from "@/designSystem/components/heading";
import { getStories } from "@/server/services/story";
import type { GetStaticProps } from "next";

type Props = {
	stories: Item[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const stories = await getStories({
		count: 100,
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

export default function Story(props: Props) {
	return (
		<Layout>
			<H2 label="全てのストーリー" />
			<StoryList stories={props.stories} />
		</Layout>
	);
}
