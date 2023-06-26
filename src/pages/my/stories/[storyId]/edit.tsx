import { Layout } from "@/features/layout";
import { GetServerSideProps } from "next";
import { z } from "zod";
import { getStoryPrivate } from "@/server/services/story";
import { getUserSession } from "@/server/getServerSideProps/getUserSession";
import { getDeviceServer } from "@/server/getServerSideProps/getDevice";
import { Device } from "@/common/util/device";
import { HeadMetaOverride } from "@/features/headMeta";
import { StoryInit } from "@/server/model/types";
import { EditStory } from "@/features/editStory";

type Props = {
	storyId: string;
	story: StoryInit;
	device: Device;
};

const querySchema = z.object({
	storyId: z.string(),
});

export const getServerSideProps: GetServerSideProps<Props> = async (
	context,
) => {
	const validated = querySchema.safeParse(context.params);
	if (!validated.success) {
		return {
			notFound: true,
		};
	}
	const user = await getUserSession(context);
	if (!user) {
		return {
			notFound: true,
		};
	}
	const story = await getStoryPrivate({
		storyId: validated.data.storyId,
		authorId: user.userId,
	}).then<StoryInit | null>((story) => {
		if (!story) return null;
		return {
			title: story.title,
			quiz: story.quiz,
			truth: story.truth,
			simpleTruth: story.simpleTruth,
			questionExamples: story.questionExamples,
		};
	});
	if (!story) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			storyId: validated.data.storyId,
			story,
			device: getDeviceServer(context),
		},
	};
};

export default function StoryEditPage(props: Props) {
	return (
		<>
			<HeadMetaOverride titleHeadOverride={"編集"} />
			<Layout>
				<EditStory story={props.story} storyId={props.storyId} />
			</Layout>
		</>
	);
}
