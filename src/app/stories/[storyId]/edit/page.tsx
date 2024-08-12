import { getDevice } from "@/server/serverComponent/getDevice";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { getStory } from "@/server/services/story";
import { updateStory } from "@/server/services/story/updateStory";
import { Metadata } from "next";
import { revalidateTag } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";
import { z } from "zod";
import { EditStorySwitchMode } from "./_components/EditStorySwitchMode";

const getDataByRequest = cache(async (storyId: string) => {
	const user = await getUserSession();
	if (!user) {
		notFound();
	}
	const story = await getStory({
		storyId: storyId,
		filter: {
			type: "withAuthorId",
			authorId: user.userId,
		},
	});
	if (!story) {
		notFound();
	}
	return {
		story,
		user,
	};
});

const paramsSchema = z.object({
	storyId: z.string(),
});

export const generateMetadata = async ({
	params,
}: { params: unknown }): Promise<Metadata> => {
	const parsed = paramsSchema.safeParse(params);
	if (!parsed.success) {
		notFound();
	}
	const { storyId } = parsed.data;
	const { story } = await getDataByRequest(storyId);
	return {
		title: `編集 - ${story.title}`,
	};
};

export default async function StoryEditPage({ params }: { params: unknown }) {
	const { storyId } = paramsSchema.parse(params);
	const { story, user } = await getDataByRequest(storyId);
	const device = getDevice();
	return (
		<EditStorySwitchMode
			story={story}
			device={device}
			saveStory={async (input) => {
				"use server";
				const ok = await updateStory({
					storyId,
					input: input,
					userId: user.userId,
				});
				if (!ok) {
					notFound();
				}
				revalidateTag(`/stories/${storyId}`);
			}}
		/>
	);
}
