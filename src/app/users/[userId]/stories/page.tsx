import { RecommendCreateStory } from "@/components/recommendCreateStory";
import { StoryList } from "@/components/storyList";
import { Heading } from "@/designSystem/components/heading";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { getStoriesWithAuthorId } from "@/server/services/story";
import { getUser } from "@/server/services/user/getUser";
import { notFound } from "next/navigation";
import { z } from "zod";
import styles from "./page.module.scss";

const paramsSchema = z.object({
	userId: z.string(),
});

export default async function UsersStories({ params }: { params: unknown }) {
	const { userId: slugUserId } = paramsSchema.parse(params);
	const user = await getUserSession();
	const isOwn = slugUserId === user?.userId;
	const [storyData, authorName] = await Promise.all([
		getStoriesWithAuthorId({
			authorId: slugUserId,
			includePrivate: isOwn,
		}),
		isOwn
			? "あなた"
			: getUser({ userId: slugUserId }).then((user) => user?.name),
	]);
	if (!authorName) {
		return notFound();
	}
	const stories = storyData.map((story) => ({
		story,
		url: `/stories/${story.id}`,
	}));

	return (
		<div className={styles.container}>
			<Heading level={1}>{authorName}のストーリー</Heading>
			{stories.length ? (
				<StoryList level={2} stories={stories} />
			) : (
				// FIXME: 別人のストーリーを見たときに表示されるのはおかしい
				<aside>
					<RecommendCreateStory />
				</aside>
			)}
		</div>
	);
}
