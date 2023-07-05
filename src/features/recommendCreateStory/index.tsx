import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import Link from "next/link";
import { gtag } from "@/common/util/gtag";

export const RecommendCreateStory: React.FC = () => {
	return (
		<aside className={styles.container}>
			<h2>自作のストーリーを投稿しませんか？</h2>
			<Link
				onClick={() => {
					gtag("click_recommend_create_story");
				}}
				href="/stories/new"
				className={components.button}
			>
				投稿する
			</Link>
		</aside>
	);
};
