import { getDevice } from "@/common/util/device";
import { HeadMetaOverride } from "@/components/headMeta";
import { Play } from "@/components/play";
import { StoryDescription } from "@/components/storyDescription";
import type { Story } from "@/server/model/story";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { getStories, getStory } from "@/server/services/story";
import { get } from "@vercel/edge-config";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { z } from "zod";

type StoryProps = {
	params: {
		storyId: string;
	};
};

const getStoryByRequest = cache(async (storyId: string) => {
	const story = await getStory({
		storyId: storyId,
		includePrivate: true,
	});
	if (!story) {
		notFound();
	}
	if (!story.published) {
		const session = await getUserSession();
		if (!session || session.userId !== story.author.id) {
			notFound();
		}
	}
	return story;
});

export const generateMetadata = async ({
	params: { storyId },
}: StoryProps): Promise<Metadata> => {
	const story = await getStoryByRequest(storyId);
	return {
		title: story.title,
		description: story.quiz,
	};
};

export const generateStaticParams = async () => {
	const stories = await getStories({
		count: 100,
	});
	return stories.map(({ id }) => ({
		storyId: id.toString(),
	}));
};

const questionLimitationSchema = z.object({
	desktopOnly: z.boolean(),
});

export default async function Story({ params: { storyId } }: StoryProps) {
	const story = await getStoryByRequest(storyId);
	return (
		<>
			<HeadMetaOverride
				titleHeadOverride={story.title}
				descriptionOverride={story.quiz}
			/>
			<StoryDescription story={story} />
			<Play
				story={story}
				fetchCanPlay={async () => {
					"use server";
					const thankyouCookie = cookies().get("thankyou");
					if (
						thankyouCookie &&
						thankyouCookie.value === process.env.THANKYOU_CODE
					) {
						return {
							canPlay: true,
						};
					}
					const questionLimitation = questionLimitationSchema.parse(
						await get("questionLimitation"),
					);

					const device = getDevice(headers().get("user-agent") || undefined);
					if (questionLimitation.desktopOnly && device !== "desktop") {
						return {
							canPlay: false,
							reason: "desktop_only",
						};
					}
					return {
						canPlay: true,
					};
				}}
			/>
		</>
	);
}
