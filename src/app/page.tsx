import { revalidateTime } from "@/common/revalidate";
import { Landing } from "@/components/landing";
import { RecommendCreateStory } from "@/components/recommendCreateStory";
import { StoryList } from "@/components/storyList";
import { GenericButton } from "@/designSystem/components/button";
import { H2 } from "@/designSystem/components/heading";
import { getStories } from "@/server/services/story";
import { getStoriesRecommended } from "@/server/services/story/ranking";
import Link from "next/link";
import styles from "./page.module.scss";

export const revalidate = revalidateTime.medium;

export default async function Home() {
	const [stories, recommend] = await Promise.all([
		getStories({
			count: 5,
		}),
		getStoriesRecommended(10),
	]);
	return (
		<div className={styles.container}>
			<div style={{ marginBottom: "48px" }}>
				<Landing />
			</div>
			<section>
				<H2 label="おすすめストーリー" />
				<StoryList
					stories={recommend.map((story) => ({
						story,
						url: `/stories/${story.id}`,
					}))}
				/>
				<Link href="/stories/rank" className={styles.seeMore}>
					<GenericButton color="none" size="medium">
						おすすめを見る
					</GenericButton>
				</Link>
			</section>
			<aside>
				<RecommendCreateStory />
			</aside>
			<section>
				<H2 label="新着ストーリー" />
				<StoryList
					stories={stories.map((story) => ({
						story,
						url: `/stories/${story.id}`,
					}))}
				/>
				<Link href="/stories" className={styles.seeMore}>
					<GenericButton color="none" size="medium">
						全てのストーリー
					</GenericButton>
				</Link>
			</section>
		</div>
	);
}
