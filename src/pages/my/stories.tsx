import { Layout } from "@/components/layout";
import { RecommendCreateStory } from "@/components/recommendCreateStory";
import { type Item, StoryList } from "@/components/storyList";
import { H1 } from "@/designSystem/components/heading";
import { getUserSession } from "@/server/getServerSideProps/getUserSession";
import { getStoriesWithAuthorId } from "@/server/services/story";
import type { GetServerSideProps } from "next";

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
	const stories = await getStoriesWithAuthorId({
		authorId: user.userId,
		includePrivate: true,
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
					<StoryList stories={props.stories} />
				) : (
					<RecommendCreateStory />
				)}
			</main>
		</Layout>
	);
}
