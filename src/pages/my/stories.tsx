import { Layout } from "@/features/layout";
import { GetServerSideProps } from "next";
import { Stories } from "@/common/components/stories";
import { H2 } from "@/common/components/h2";
import { getStoriesPrivate } from "@/server/services/story";
import { getUser } from "@/server/getServerSideProps/getUser";

type Props = {
	stories: {
		id: string;
		title: string;
		quiz: string;
		url: string;
	}[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (
	context,
) => {
	const user = await getUser(context);
	if (!user) {
		return {
			notFound: true,
		};
	}
	const stories = await getStoriesPrivate({
		autherEmail: user.email,
	});
	return {
		props: {
			stories: stories.map(({ id, title, quiz }) => ({
				id,
				title,
				quiz,
				url: `/my/stories/${id}`,
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
