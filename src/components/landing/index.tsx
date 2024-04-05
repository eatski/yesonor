/* eslint-disable @next/next/no-img-element */
import { brand } from "@/common/texts";
import styles from "./styles.module.scss";
import { QuestionAndAnswer } from "@/components/questionAndAnswer";
import Link from "next/link";
import components from "@/designSystem/components.module.scss";
import { useRouter } from "next/router";
import { Item } from "@/components/storyList";
import { useCallback, useState } from "react";

export const Landing: React.FC<{ stories: Item[] }> = ({ stories }) => {
	const router = useRouter();
	const [answer, setAnswer] = useState<string | null>(null);
	const setAnswerYes = useCallback(() => {
		setTimeout(() => {
			setAnswer("はい");
		}, 1000);
	}, []);
	return (
		<main className={styles.container}>
			<h1>{brand.serviceName}</h1>
			<p>
				{brand.serviceName}({brand.serviceNickname})は{brand.serviceDescription}
			</p>
			<div className={styles.content}>
				<QuestionAndAnswer
					question={"Yesonorでは質問に対してAIが回答をしてくれますか？"}
					answer={answer}
					onQuestionTypingEnd={setAnswerYes}
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
			<p
				style={{
					marginTop: "48px",
					color: "red",
				}}
			>
				<a
					href="https://github.com/eatski/yesonor/issues/129"
					style={{ color: "blue" }}
				>
					現在のサービスの状況につきまして
				</a>
			</p>
		</main>
	);
};
