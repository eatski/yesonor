import { gtagEvent } from "@/common/util/gtag";
import components from "@/designSystem/components.module.scss";
import Link from "next/link";
import styles from "./styles.module.scss";

export const RecommendCreateStory: React.FC = () => {
	return (
		<aside className={styles.container}>
			<h2>自作のストーリーを投稿しませんか？</h2>
			<Link
				onClick={() => {
					gtagEvent("click_recommend_create_story");
				}}
				href="/stories/new"
				className={components.button}
			>
				投稿する
			</Link>
		</aside>
	);
};
