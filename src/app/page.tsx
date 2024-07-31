import { revalidateTime } from "@/common/revalidate";
import { Landing } from "@/components/landing";
import { RecommendCreateStory } from "@/components/recommendCreateStory";
import { StoryList } from "@/components/storyList";
import { H2 } from "@/designSystem/components/heading";
import { getStories } from "@/server/services/story";
import { getStoriesRecommended } from "@/server/services/story/ranking";

export const revalidate = revalidateTime.medium;

export default async function Home() {
	const [stories, recommend] = await Promise.all([
		getStories({
			count: 5,
		}),
		getStoriesRecommended(10),
	]);
	return (
		<div>
			<div style={{ marginBottom: "48px" }}>
				<Landing />
			</div>
			<section style={{ marginBottom: "24px" }}>
				<H2 label="おすすめストーリー" />
				<StoryList
					stories={recommend.map((story) => ({
						story,
						url: `/stories/${story.id}`,
					}))}
					seeMoreUrl={"/stories/rank"}
				/>
			</section>
			<div style={{ marginBottom: "24px" }}>
				<RecommendCreateStory />
			</div>
			<section style={{ marginBottom: "24px" }}>
				<H2 label="新着ストーリー" />
				<StoryList
					stories={stories.map((story) => ({
						story,
						url: `/stories/${story.id}`,
					}))}
					seeMoreUrl={"/stories"}
				/>
			</section>
		</div>
	);
}
