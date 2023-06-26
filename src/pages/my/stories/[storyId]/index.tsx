import { Play } from "@/features/play";
import { Layout } from "@/features/layout";
import { StoryDescription } from "@/features/storyDescription";
import { GetServerSideProps } from "next";
import { z } from "zod";
import { MyStoryMenu } from "@/features/myStoryMenu";
import { getStoryHeadPrivate } from "@/server/services/story";
import { getUserSession } from "@/server/getServerSideProps/getUserSession";
import { getDeviceServer } from "@/server/getServerSideProps/getDevice";
import { Device } from "@/common/util/device";
import { HeadMetaOverride } from "@/features/headMeta";
import { StoryHead } from "@/server/model/types";

type Props = {
	story: StoryHead;
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
	const story = await getStoryHeadPrivate({
		storyId: validated.data.storyId,
		authorId: user.userId,
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

export default function StoryDraftPage(props: Props) {
	return (
		<>
			<HeadMetaOverride
				titleHeadOverride={props.story.title}
				descriptionOverride={props.story.quiz}
			/>
			<Layout
				upper={
					<MyStoryMenu
						storyId={props.story.id}
						published={props.story.published}
						canUseFileDrop={props.device === "desktop"}
					/>
				}
			>
				<StoryDescription story={props.story} />
				<Play storyId={props.story.id} />
			</Layout>
		</>
	);
}
