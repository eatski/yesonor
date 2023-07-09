import { Play } from "@/components/play";
import { Layout } from "@/components/layout";
import { StoryDescription } from "@/components/storyDescription";
import { GetServerSideProps } from "next";
import { z } from "zod";
import { MyStoryMenu } from "@/components/myStoryMenu";
import { getStoryPrivate } from "@/server/services/story";
import { getUserSession } from "@/server/getServerSideProps/getUserSession";
import { getDeviceServer } from "@/server/getServerSideProps/getDevice";
import { Device } from "@/common/util/device";
import { HeadMetaOverride } from "@/components/headMeta";
import { Story } from "@/server/model/types";

type Props = {
	story: Story;
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
						initialStory={props.story}
						canUseFileDrop={props.device === "desktop"}
					/>
				}
			>
				<StoryDescription story={props.story} />
				<Play story={props.story} />
			</Layout>
		</>
	);
}
