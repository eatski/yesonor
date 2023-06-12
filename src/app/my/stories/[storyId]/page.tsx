import { NextRequestProps } from "@/libs/next/request";
import {
	getStories,
	getStoryHead,
	getStoryHeadPrivate,
} from "@/server/services/story";
import { texts } from "@/texts";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ServerStoryDescription } from "./_components/play";
import { Play } from "@/features/play";
import { Suspense } from "react";
import { Loading } from "@/app/_components/loading";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { MainContent } from "@/app/_components/main";
import { UpperArea } from "./_components/upper";
import { MyStoryMenu } from "@/features/myStoryMenu";
import { getDeviceServer } from "@/server/serverComponent/getDevice";

export const dynamicParams = true;

const querySchema = z.object({
	storyId: z.string(),
});

export const generateMetadata: (arg: NextRequestProps) => Promise<Metadata> =
	async ({ params }) => {
		const validated = querySchema.safeParse(params);
		if (!validated.success) {
			notFound();
		}
		const session = await getUserSession();
		if (!session) {
			notFound();
		}

		const story = await getStoryHeadPrivate({
			storyId: validated.data.storyId,
			authorId: session.userId,
		});
		if (!story) {
			notFound();
		}

		return {
			title: `${story.title} - ${texts.serviceName}`,
			description: story.quiz,
		};
	};
export async function generateStaticParams() {
	const stories = await getStories({
		count: 20,
	});
	return stories.map((story) => ({
		storyId: story.id,
	}));
}

export default function Story({ params }: NextRequestProps) {
	const validated = querySchema.safeParse(params);
	if (!validated.success) {
		notFound();
	}
	const storyId = validated.data.storyId;
	return (
		<>
			<UpperArea>
				<Suspense>
					{/* @ts-expect-error */}
					<ServeMyStoryMenu storyId={storyId} />
				</Suspense>
			</UpperArea>
			<MainContent>
				<Suspense fallback={<Loading />}>
					{/* @ts-expect-error */}
					<ServerStoryDescription storyId={validated.data.storyId} />
					<Play storyId={validated.data.storyId} />
				</Suspense>
			</MainContent>
		</>
	);
}

const ServeMyStoryMenu = async ({ storyId }: { storyId: string }) => {
	const session = await getUserSession();
	if (!session) {
		notFound();
	}
	const story = await getStoryHeadPrivate({
		storyId,
		authorId: session.userId,
	});
	if (!story) {
		notFound();
	}
	const device = getDeviceServer();
	return (
		<MyStoryMenu
			storyId={storyId}
			published={story.published}
			canUseFileDrop={device === "desktop"}
		/>
	);
};
