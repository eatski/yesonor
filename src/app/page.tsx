import { revalidateTime } from "@/common/revalidate";
import { Landing } from "@/components/landing";
import { RecommendCreateStory } from "@/components/recommendCreateStory";
import { StoryList } from "@/components/storyList";
import { GenericButton } from "@/designSystem/components/button";
import { Heading } from "@/designSystem/components/heading";
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
			<div className={styles.landing}>
				<Landing />
			</div>
			<section className={styles.region}>
				<Heading level={2}>おすすめストーリー</Heading>
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
			<aside className={styles.region}>
				<RecommendCreateStory />
			</aside>
			<section className={styles.region}>
				<Heading level={2}>新着ストーリー</Heading>
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
