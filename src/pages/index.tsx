import { Layout } from "@/features/layout";
import { Landing } from "@/features/landing";
import { GetStaticProps } from "next";
import { Item, Stories } from "@/common/components/stories";
import { H2 } from "@/common/components/heading";
import { getStories } from "@/server/services/story";
import { revalidateTime } from "@/common/revalidate";
import { RecommendCreateStory } from "@/features/recommendCreateStory";
import { getStoriesRecommended } from "@/server/services/story/ranking";
import { useSession } from "next-auth/react";
import { RequireLogin } from "@/features/requireLogin";

type Props = {
	stories: Item[];
	recommend: Item[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const [stories, recommend] = await Promise.all([
		getStories({
			count: 5,
		}),
		getStoriesRecommended(),
	]);
	return {
		props: {
			stories: stories.map((story) => ({
				story,
				url: `/stories/${story.id}`,
			})),
			recommend: recommend.map((story) => ({
				story,
				url: `/stories/${story.id}`,
			})),
		},
		revalidate: revalidateTime.short,
	};
};

export default function Home({ stories, recommend }: Props) {
	const session = useSession();
	return (
		<>
			<Layout>
				<div style={{ marginBottom: "72px" }}>
					<Landing stories={recommend} />
				</div>
				<section style={{ marginBottom: "24px" }}>
					<H2 label="おすすめストーリー" />
					<Stories stories={recommend} />
				</section>
				<section style={{ marginBottom: "24px" }}>
					<H2 label="新着ストーリー" />
					<Stories stories={stories} seeMoreUrl={"/stories"} />
				</section>
				<div style={{ marginBottom: "24px" }}>
					{session.status !== "loading" ? (
						session.status === "authenticated" ? (
							<RecommendCreateStory />
						) : (
							<RequireLogin />
						)
					) : null}
				</div>
			</Layout>
		</>
	);
}
