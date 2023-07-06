import { Layout } from "@/components/layout";
import { GetServerSideProps } from "next";
import { Item, Stories } from "@/components/stories";
import { H1 } from "@/designSystem/components/heading";
import { getStoriesPrivate } from "@/server/services/story";
import { getUserSession } from "@/server/getServerSideProps/getUserSession";
import { RecommendCreateStory } from "@/components/recommendCreateStory";

type Props = {
	stories: Item[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (
	context,
) => {
	const user = await getUserSession(context);
	if (!user) {
		return {
			notFound: true,
		};
	}
	const stories = await getStoriesPrivate({
		authorId: user.userId,
	});
	return {
		props: {
			stories: stories.map((story) => ({
				story,
				url: `/my/stories/${story.id}`,
			})),
		},
	};
};

export default function Story(props: Props) {
	return (
		<Layout>
			<main>
				<H1>自分のストーリー</H1>
				{props.stories.length ? (
					<Stories stories={props.stories} />
				) : (
					<RecommendCreateStory />
				)}
			</main>
		</Layout>
	);
}
