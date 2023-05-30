import { H2 } from "@/common/components/h2";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import dayjs from "dayjs";
import { texts } from "@/texts";
import { AiOutlineCopy, AiOutlineTwitter } from "react-icons/ai";
import CopyToClipboard from "react-copy-to-clipboard";

export type Story = {
	id: string;
	title: string;
	quiz: string;
	publishedAt: number | null;
	published: boolean;
};
dayjs.locale("ja");

export const StoryDescription: React.FC<Story> = ({
	id,
	title,
	quiz,
	publishedAt,
	published,
}) => {
	const url = `https://iesona.com/stories/${id}`;
	const twitterUrl = new URL("https://twitter.com/intent/tweet");
	twitterUrl.searchParams.set("url", url);
	twitterUrl.searchParams.set("text", quiz);
	twitterUrl.searchParams.set(
		"hashtags",
		`${texts.serviceNickname},水平思考クイズ,ウミガメのスープ`,
	);
	return (
		<div className={styles.container}>
			<H2 label={title} />
			{publishedAt && (
				<dl>
					<div className={styles.basic}>
						<dt>投稿日</dt>
						<dd>{dayjs(publishedAt).format("YYYY/MM/DD")}</dd>
					</div>
				</dl>
			)}
			<p>{quiz}</p>
			{published && (
				<div className={styles.share}>
					<a
						href={twitterUrl.toString()}
						className={components.buttonLink}
						target="_blank"
						rel="noreferrer"
					>
						<AiOutlineTwitter className={styles.twitter} />
						ツイート
					</a>
					<CopyToClipboard
						text={url}
						onCopy={() => {
							alert("クリップボードにコピーしました");
						}}
					>
						<button className={components.buttonLink}>
							<AiOutlineCopy />
							URLをコピー
						</button>
					</CopyToClipboard>
				</div>
			)}
		</div>
	);
};
