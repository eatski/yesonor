import Link from "next/link";
import styles from "./styles.module.scss";
import components from "@/designSystem/components.module.scss";
import { AiFillPlayCircle as StartIcon } from "react-icons/ai";
import { StoryHead } from "@/server/model/story";

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
								<h2 className={styles.title}>{story.title}</h2>
								<p>{story.quiz}</p>
							</Link>
							<Link
								aria-label="このストーリーの謎を解く"
								href={url}
								className={styles.iconContainer}
							>
								<StartIcon className={components.iconButton} />
							</Link>
							<aside>
								{breakContent?.step &&
									(index + 1) % breakContent.step === 0 && (
										<breakContent.Component />
									)}
							</aside>
						</li>
					);
				})}
			</ul>
			{seeMoreUrl && (
				<div className={styles.seeMore}>
					<Link className={components.buttonLink} href={seeMoreUrl}>
						もっと見る
					</Link>
				</div>
			)}
		</div>
	);
};
