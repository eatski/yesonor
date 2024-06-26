import { brand } from "@/common/texts";
import components from "@/designSystem/components.module.scss";
import {
	AnchorButton,
	Button,
	ButtonIconWrapper,
} from "@/designSystem/components/button";
import { H1 } from "@/designSystem/components/heading";
import type { StoryHead } from "@/server/model/story";
import dayjs from "dayjs";
import CopyToClipboard from "react-copy-to-clipboard";
import { AiOutlineCopy, AiOutlineTwitter } from "react-icons/ai";
import { useToast } from "../toast";
import styles from "./styles.module.scss";

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
	const toast = useToast();
	return (
		<header className={styles.container}>
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
					<AnchorButton
						href={twitterUrl.toString()}
						className={components.buttonLink}
						target="_blank"
						rel="noreferrer"
						color={"none"}
						size="small"
					>
						<ButtonIconWrapper>
							<AiOutlineTwitter
								role="presentation"
								className={styles.twitter}
							/>
						</ButtonIconWrapper>
						ツイート
					</AnchorButton>
					<CopyToClipboard
						text={url}
						onCopy={() => {
							toast("URLをコピーしました。");
						}}
					>
						<Button color="none" size="small">
							<ButtonIconWrapper>
								<AiOutlineCopy role="presentation" />
							</ButtonIconWrapper>
							URLをコピー
						</Button>
					</CopyToClipboard>
				</div>
			)}
		</header>
	);
};
