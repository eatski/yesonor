import { NextRequestProps } from "@/libs/next/request";
import { getStoryHead } from "@/server/services/story";
import { texts } from "@/texts";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ServerStoryDescription } from "./_components/play";
import { Play } from "@/features/play";
import { Suspense } from "react";
import { Loading } from "@/app/_components/loading";
import { MainContent } from "@/app/_components/main";

const querySchema = z.object({
	storyId: z.string(),
});

export const generateMetadata: (arg: NextRequestProps) => Promise<Metadata> =
	async ({ params }) => {
		const validated = querySchema.safeParse(params);
		if (!validated.success) {
			notFound();
		}

		const story = await getStoryHead({
			storyId: validated.data.storyId,
		});
		if (!story) {
			notFound();
		}

		return {
			title: `${story.title} - ${texts.serviceName}`,
			description: story.quiz,
		};
	};

export default async function Story({ params }: NextRequestProps) {
	const validated = querySchema.safeParse(params);
	if (!validated.success) {
		notFound();
	}
	return (
		<MainContent>
			<Suspense fallback={<Loading />}>
				{/* @ts-expect-error */}
				<ServerStoryDescription storyId={validated.data.storyId} />
				<Play storyId={validated.data.storyId} />
			</Suspense>
		</MainContent>
	);
}
