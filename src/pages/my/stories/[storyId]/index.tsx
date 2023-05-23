import { Play } from "@/features/play";
import { Layout } from "@/features/layout";
import { StoryDescription } from "@/features/storyDescription";
import { GetServerSideProps } from "next";
import { z } from "zod";
import { MyStoryMenu } from "@/features/myStoryMenu";
import { getStoryPrivate } from "@/server/services/story";
import { getUser } from "@/server/getServerSideProps/getUser";
import { getDeviceServer } from "@/server/getServerSideProps/getDevice";
import { Device } from "@/common/util/device";
import { HeadMetaOverride } from "@/features/headMeta";

type Story = {
	title: string;
	quiz: string;
	published: boolean;
	publishedAt: number | null;
};

type Props = {
	storyId: string;
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
	const user = await getUser(context);
	if (!user) {
		return {
			notFound: true,
		};
	}
	const story = await getStoryPrivate({
		storyId: validated.data.storyId,
		autherEmail: user.email,
	});
	if (!story) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			storyId: validated.data.storyId,
			story: {
				title: story.title,
				quiz: story.quiz,
				publishedAt: story.publishedAt?.getTime() ?? null,
				published: story.published,
			},
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
						storyId={props.storyId}
						published={props.story.published}
						canUseFileDrop={props.device === "desktop"}
					/>
				}
			>
				<StoryDescription
					id={props.storyId}
					title={props.story.title}
					quiz={props.story.quiz}
					publishedAt={props.story.publishedAt}
					published={props.story.published}
				/>
				<Play storyId={props.storyId} requireBotCheck={false} />
			</Layout>
		</>
	);
}
