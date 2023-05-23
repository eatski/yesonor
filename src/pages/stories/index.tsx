import { Layout } from "@/features/layout";
import { GetStaticProps } from "next";
import { Stories } from "@/common/components/stories";
import { H2 } from "@/common/components/h2";
import { getStories } from "@/server/services/story";
import { revalidateTime } from "@/common/revalidate";

type Props = {
	stories: {
		id: string;
		title: string;
		quiz: string;
		url: string;
	}[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const stories = await getStories({
		count: 20,
	});
	return {
		props: {
			stories: stories.map(({ id, title, quiz }) => ({
				id,
				title,
				quiz,
				url: `/stories/${id}`,
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
