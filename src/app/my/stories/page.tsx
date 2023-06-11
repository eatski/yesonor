import { Stories } from "@/common/components/stories";
import { H2 } from "@/common/components/h2";
import { getStoriesPrivate } from "@/server/services/story";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { Layout } from "@/app/_layout";
import { Suspense } from "react";
import { Loading } from "@/app/_components/loading";

export default async function Story() {
	return (
		// @ts-expect-error
		<Layout>
			<Suspense fallback={<Loading />}>
				{/* @ts-expect-error */}
				<MyStory />
			</Suspense>
		</Layout>
	);
}

const MyStory = async () => {
	const user = await getUserSession();
	if (!user) {
		return {
			notFound: true,
		};
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
};
