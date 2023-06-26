import { Layout } from "@/features/layout";
import { GetServerSideProps } from "next";
import { Item, Stories } from "@/common/components/stories";
import { H2 } from "@/common/components/h2";
import { getStoriesPrivate } from "@/server/services/story";
import { getUserSession } from "@/server/getServerSideProps/getUserSession";

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
			<H2 label="自分のストーリー" />
			<Stories stories={props.stories} />
		</Layout>
	);
}
