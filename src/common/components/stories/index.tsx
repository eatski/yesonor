import Link from "@/common/components/link";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import { AiFillPlayCircle as StartIcon } from "react-icons/ai";
import { StoryHead } from "@/server/model/types";

export type Item = {
	story: StoryHead;
	url: string;
};

export const Stories: React.FC<{ stories: Item[] }> = ({ stories }) => {
	return (
		<div className={styles.container}>
			{stories.map(({ story, url }) => {
				return (
					<article key={story.id}>
						<Link href={url}>
							<h3 className={styles.title}>{story.title}</h3>
							<p>{story.quiz}</p>
						</Link>
						<Link
							aria-label="このストーリーの謎を解く"
							href={url}
							className={styles.iconContainer}
						>
							<StartIcon className={components.iconButton} />
						</Link>
					</article>
				);
			})}
		</div>
	);
};
