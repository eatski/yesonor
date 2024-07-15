import type { Device } from "@/common/util/device";
import { EditStory } from "@/components/editStory";
import { EditStoryYaml } from "@/components/editStoryYaml";
import { HeadMetaOverride } from "@/components/headMeta";
import { Layout } from "@/components/layout";
import { getDeviceServer } from "@/server/getServerSideProps/getDevice";
import { getUserSession } from "@/server/getServerSideProps/getUserSession";
import type { Story } from "@/server/model/story";
import { getStoryPrivate } from "@/server/services/story";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { z } from "zod";

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

export default function StoryEditPage(props: Props) {
	const router = useRouter();

	return (
		<>
			<HeadMetaOverride titleHeadOverride={"編集"} />
			<Layout>
				{router.query.mode === "file" ? (
					<EditStoryYaml initialStory={props.story} />
				) : (
					<EditStory story={props.story} storyId={props.storyId} />
				)}
			</Layout>
		</>
	);
}
