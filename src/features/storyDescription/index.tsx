import { H2 } from "@/common/components/h2";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import { StoryHead } from "@/server/model/types";
import { Share } from "./components/share";

dayjs.locale("ja");

export const StoryDescription: React.FC<{
	story: StoryHead;
}> = ({ story }) => {
	const { title, quiz, publishedAt, published, author } = story;
	return (
		<div className={styles.container}>
			<H2 label={title} />
			{publishedAt && (
				<dl>
					<div className={styles.basic}>
						<dt>投稿日</dt>
						<dd>{dayjs(publishedAt).format("YYYY/MM/DD")}</dd>
						{author.name && (
							<>
								<dt>作成者</dt>
								<dd>{author.name}</dd>
							</>
						)}
					</div>
				</dl>
			)}
			<p>{quiz}</p>
			{published && <Share story={story} />}
		</div>
	);
};
