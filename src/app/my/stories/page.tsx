import { Stories } from "@/common/components/stories";
import { H2 } from "@/common/components/h2";
import { getStoriesPrivate } from "@/server/services/story";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { notFound } from "next/navigation";

export default async function Story() {
	const user = await getUserSession();
	if (!user) {
		notFound();
	}
	const stories = await getStoriesPrivate({
		authorId: user.userId,
	});
	return (
		<>
			<H2 label="自分のストーリー" />
			<Stories
				stories={stories.map((story) => ({
					story,
					url: `/my/stories/${story.id}`,
				}))}
			/>
		</>
	);
}
