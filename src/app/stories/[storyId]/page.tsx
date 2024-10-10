import { brand } from "@/common/texts";
import { Play } from "@/components/play";
import { StoryDescription } from "@/components/storyDescription";
import type { Story } from "@/server/model/story";
import { getDevice } from "@/server/serverComponent/getDevice";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { setupABTestValue } from "@/server/serverComponent/setupABTestingVariant";
import { checkAnswer } from "@/server/services/answer";
import { askQuestion } from "@/server/services/question";
import { deleteStory } from "@/server/services/story/deleteStory";
import { getStories } from "@/server/services/story/getStories";
import { getStory } from "@/server/services/story/getStory";
import {
	publishStory,
	unpublishStory,
} from "@/server/services/story/publishStory";
import { postStoryEvalution } from "@/server/services/storyEvalution/post";
import { getQuestionLimitation } from "@/server/services/user/limitation";
import { Metadata } from "next";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { MyStoryMenu } from "../../../components/myStoryMenu";
import styles from "./page.module.scss";

type StoryProps = {
	params: {
		storyId: string;
	};
};

const getStoryByRequest = cache(
	async (storyId: string, userId: string | null) => {
		try {
			const story = await getStory({
				storyId: storyId,
				filter: userId
					? {
							type: "publicOrWithAuthor",
							authorId: userId,
						}
					: {
							type: "onlyPublic",
						},
			});
			if (!story) {
				notFound();
			}
			return story;
		} catch (e) {
			console.error(e);
			throw e;
		}
	},
);

export const generateMetadata = async ({
	params: { storyId },
}: StoryProps): Promise<Metadata> => {
	const session = await getUserSession();
	const story = await getStoryByRequest(storyId, session?.userId || null);
	const title = `${story.title} - ${brand.serviceDescription}`;
	const description = story.quiz;
	return {
		title,
		description,
		openGraph: {
			title,
			description,
		},
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

const MyStoryMenuServer = async ({ story }: { story: Story }) => {
	const session = await getUserSession().catch((e) => {
		console.error(e);
		throw e;
	});
	const { id, published, publishedAt, author } = story;
	if (!session || author.id !== session.userId) {
		return null;
	}
	return (
		<div className={styles.storyMenu}>
			<MyStoryMenu
				story={story}
				deleteStory={async () => {
					"use server";
					const result = await deleteStory({
						storyId: id,
						userId: session.userId,
					});
					switch (result) {
						case "NOT_FOUND":
							notFound();
						case "OK":
							revalidateTag(`/stories/${id}`);
					}
				}}
				toggleStoryPublic={async () => {
					"use server";
					if (published) {
						const result = await unpublishStory({
							storyId: id,
							userId: session.userId,
						});
						switch (result) {
							case "NOT_FOUND":
								notFound();
							case "OK":
								revalidateTag(`/stories/${id}`);
						}
					} else {
						const result = await publishStory({
							storyId: id,
							userId: session.userId,
							atFirst: publishedAt === null,
						});
						switch (result) {
							case "NOT_FOUND":
								notFound();
							case "OK":
								revalidateTag(`/stories/${id}`);
						}
					}
				}}
			/>
		</div>
	);
};

export default async function StoryPage({ params: { storyId } }: StoryProps) {
	const session = await getUserSession().catch((e) => {
		console.error(e);
		throw e;
	});
	const story = await getStoryByRequest(storyId, session?.userId || null);
	return (
		<>
			<MyStoryMenuServer story={story} />
			<div className={styles.heading}>
				<StoryDescription story={story} />
			</div>
			<Play
				story={story}
				fetchCanPlay={async () => {
					"use server";
					const limited = await getQuestionLimitation({
						device: getDevice(),
						getCookie: (key) => cookies().get(key)?.value || null,
					});
					if (limited) {
						return {
							canPlay: false,
							reason: limited,
						};
					}
					return {
						canPlay: true,
					};
				}}
				sendQuestion={async (input) => {
					"use server";
					return askQuestion(input.text, story, setupABTestValue());
				}}
				checkAnswer={async (input) => {
					"use server";
					return checkAnswer(input.text, story);
				}}
				postStoryEvalution={async () => {
					"use server";
					const user = await getUserSession();
					if (!user) {
						notFound();
					}
					await postStoryEvalution({
						storyId: story.id,
						userId: user.userId,
					});
				}}
			/>
		</>
	);
}
