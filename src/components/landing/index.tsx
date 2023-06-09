/* eslint-disable @next/next/no-img-element */
import { brand } from "@/common/texts";
import styles from "./styles.module.scss";
import { QuestionAndAnswer } from "@/components/questionAndAnswer";
import { useCallback, useState } from "react";
import Link from "next/link";
import components from "@/designSystem/components.module.scss";
import { useRouter } from "next/router";
import { Item } from "@/components/storyList";

const QUESTIONS = [
	{
		question: "Yesonorでは質問に対してAIが回答をしてくれますか？",
		answer: "はい",
	},
	{
		question: "Yesonorでは自分の考えた水平思考クイズを投稿できますか？",
		answer: "はい",
	},
	{
		question: "Yesonorは他の人が投稿した水平思考クイズを遊べますか？",
		answer: "はい",
	},
	{
		question: "Yesonorでは回答を人間が考えていますか？",
		answer: "いいえ",
	},
	{
		question: "Yesonorの読み方は「いえそな」ですか？",
		answer: "はい",
	},
	{
		question: "Yesonorは無料で遊べますか？",
		answer: "はい",
	},

	{
		question: "Yesonorは最高ですか？",
		answer: "わからない",
	},
	{
		question: "Yesonorで水平思考クイズを遊ぶには2人以上の参加者が必要ですか？",
		answer: "いいえ",
	},
];

export const Landing: React.FC<{ stories: Item[] }> = ({ stories }) => {
	const [answer, setAnswer] = useState<string | null | undefined>(undefined);
	const questionIndex = 0;
	const onQuestionTypingEnd = useCallback(() => {
		setTimeout(() => {
			setAnswer(QUESTIONS[questionIndex].answer);
		}, 1000);
	}, []);
	const router = useRouter();
	return (
		<main className={styles.container}>
			<h1>{brand.serviceName}</h1>
			<p>
				{brand.serviceName}({brand.serviceNickname})は{brand.serviceDescription}
			</p>
			<div className={styles.content}>
				<QuestionAndAnswer
					question={QUESTIONS[questionIndex].question}
					answer={answer}
					onQuestionTypingEnd={onQuestionTypingEnd}
				/>
			</div>
			<div className={styles.buttons}>
				<Link href="/situationPuzzle" className={components.buttonLink}>
					水平思考クイズとは？
				</Link>
				<button
					type="button"
					onClick={() => {
						const pickup = stories.at(
							Math.floor(Math.random() * stories.length),
						);
						if (pickup) {
							router.push(pickup.url);
						}
					}}
					className={components.button}
				>
					今すぐ謎を解く
				</button>
			</div>
		</main>
	);
};
