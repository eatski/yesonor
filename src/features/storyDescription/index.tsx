import { H1 } from "@/common/components/heading";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import dayjs from "dayjs";
import { brand } from "@/common/texts";
import { AiOutlineCopy, AiOutlineTwitter } from "react-icons/ai";
import CopyToClipboard from "react-copy-to-clipboard";
import { StoryHead } from "@/server/model/types";

dayjs.locale("ja");

export const StoryDescription: React.FC<{
	story: StoryHead;
}> = ({ story: { id, title, quiz, publishedAt, published, author } }) => {
	const url = `https://iesona.com/stories/${id}`;
	const twitterUrl = new URL("https://twitter.com/intent/tweet");
	twitterUrl.searchParams.set("url", url);
	twitterUrl.searchParams.set("text", quiz);
	twitterUrl.searchParams.set(
		"hashtags",
		`${brand.serviceNickname},水平思考クイズ,ウミガメのスープ`,
	);
	return (
		<div className={styles.container}>
			<H1>{title}</H1>
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
