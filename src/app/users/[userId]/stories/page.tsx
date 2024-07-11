import { RecommendCreateStory } from "@/components/recommendCreateStory";
import { StoryList } from "@/components/storyList";
import { H1 } from "@/designSystem/components/heading";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { getStoriesWithAuthorId } from "@/server/services/story";
import { z } from "zod";

const paramsSchema = z.object({
	userId: z.string(),
});

export default async function UsersStories({ params }: { params: unknown }) {
	const { userId: slugUserId } = paramsSchema.parse(params);
	const user = await getUserSession();
	const isOwn = slugUserId === user?.userId;
	const data = await getStoriesWithAuthorId({
		authorId: slugUserId,
		includePrivate: isOwn,
	});
	const authorName = data.at(0)?.author.name;
	const stories = data.map((story) => ({
		story,
		url: `/stories/${story.id}`,
	}));

	const displayName = isOwn ? "あなた" : authorName || "匿名ユーザー";

	return (
		<main>
			<H1>{displayName}のストーリー</H1>
			{stories.length ? (
				<StoryList stories={stories} />
			) : (
				<RecommendCreateStory />
			)}
		</main>
	);
}
