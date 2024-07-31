import { GenericButton } from "@/designSystem/components/button";
import { Heading } from "@/designSystem/components/heading";
import type { StoryHead } from "@/server/model/story";
import Link from "next/link";
import styles from "./styles.module.scss";

export type Item = {
	story: StoryHead;
	url: string;
};

export const StoryList: React.FC<{
	stories: Item[];
	seeMoreUrl?: string;
	breakContent?: {
		Component: React.ElementType;
		step: number;
	};
}> = ({ stories, seeMoreUrl, breakContent }) => {
	return (
		<div className={styles.container}>
			<ul>
				{stories.map(({ story, url }, index) => {
					return (
						<li key={story.id}>
							<Link href={url}>
								<Heading level={3}>{story.title}</Heading>
								<p>{story.quiz}</p>
							</Link>
							{index + 1 !== stories.length &&
								breakContent?.step &&
								(index + 1) % breakContent.step === 0 && (
									<aside>
										<breakContent.Component />
									</aside>
								)}
						</li>
					);
				})}
			</ul>
			{seeMoreUrl && (
				<div className={styles.seeMore}>
					<Link href={seeMoreUrl}>
						<GenericButton color="none" size="medium">
							もっと見る
						</GenericButton>
					</Link>
				</div>
			)}
		</div>
	);
};
