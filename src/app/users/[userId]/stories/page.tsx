import { RecommendCreateStory } from "@/components/recommendCreateStory";
import { StoryList } from "@/components/storyList";
import { H1 } from "@/designSystem/components/heading";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { getStoriesWithAuthorId } from "@/server/services/story";
import { getUser } from "@/server/services/user";
import { notFound } from "next/navigation";
import { z } from "zod";

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
		<main>
			<H1>{authorName}のストーリー</H1>
			{stories.length ? (
				<StoryList stories={stories} />
			) : (
				// FIXME: 別人のストーリーを見たときに表示されるのはおかしい
				<RecommendCreateStory />
			)}
		</main>
	);
}
