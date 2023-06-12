"use client";
import { StoryHead } from "@/server/model/types";
import styles from "../styles.module.scss";
import components from "@/styles/components.module.scss";
import { texts } from "@/texts";
import { AiOutlineCopy, AiOutlineTwitter } from "react-icons/ai";
import CopyToClipboard from "react-copy-to-clipboard";

export const Share = ({ story }: { story: StoryHead }) => {
	const url = `https://iesona.com/stories/${story.id}`;
	const twitterUrl = new URL("https://twitter.com/intent/tweet");
	twitterUrl.searchParams.set("url", url);
	twitterUrl.searchParams.set("text", story.quiz);
	twitterUrl.searchParams.set(
		"hashtags",
		`${texts.serviceNickname},水平思考クイズ,ウミガメのスープ`,
	);
	return (
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
	);
};
