import Link from "next/link";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import { AiFillPlayCircle as StartIcon } from "react-icons/ai";

export type Story = {
	id: string;
	title: string;
	quiz: string;
	url: string;
};

export const Stories: React.FC<{ stories: Story[] }> = ({ stories }) => {
	return (
		<div className={styles.container}>
			{stories.map((story) => {
				return (
					<article key={story.id}>
						<Link href={story.url}>
							<h3 className={styles.title}>{story.title}</h3>
							<p>{story.quiz}</p>
						</Link>
						<Link
							aria-label="このストーリーの謎を解く"
							href={story.url}
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
