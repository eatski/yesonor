import { Play } from "@/components/play";
import { Layout } from "@/components/layout";
import { StoryDescription } from "@/components/storyDescription";
import { GetStaticPaths, GetStaticProps } from "next";
import { z } from "zod";
import { getStories, getStory } from "@/server/services/story";
import { revalidateTime } from "@/common/revalidate";
import { HeadMetaOverride } from "@/components/headMeta";
import { Story } from "@/server/model/story";

type Props = {
	story: Story;
};

const querySchema = z.object({
	storyId: z.string(),
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const validated = querySchema.safeParse(params);
	if (!validated.success) {
		return {
			notFound: true,
		};
	}

	const story = await getStory({
		storyId: validated.data.storyId,
	});
	if (!story) {
		return {
			notFound: true,
			revalidate: revalidateTime.medium,
		};
	}
	return {
		props: {
			story,
		},
		revalidate: revalidateTime.medium,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const stories = await getStories({
		count: 20,
	});
	return {
		paths: stories.map(({ id }) => ({
			params: {
				storyId: id.toString(),
			},
		})),
		fallback: "blocking",
	};
};

export default function Story(props: Props) {
	return (
		<>
			<HeadMetaOverride
				titleHeadOverride={props.story.title}
				descriptionOverride={props.story.quiz}
			/>
			<Layout>
				<StoryDescription story={props.story} />
				<Play story={props.story} />
			</Layout>
		</>
	);
}
