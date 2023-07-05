import { Layout } from "@/features/layout";
import { GetStaticProps } from "next";
import { Item, Stories } from "@/common/components/stories";
import { H2 } from "@/common/components/heading";
import { getStories } from "@/server/services/story";
import { revalidateTime } from "@/common/revalidate";

type Props = {
	stories: Item[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const stories = await getStories({
		count: 30,
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
			<H2 label="新着ストーリー" />
			<Stories stories={props.stories} />
		</Layout>
	);
}
