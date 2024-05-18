/* eslint-disable @next/next/no-img-element */
import { brand } from "@/common/texts";
import { QuestionAndAnswer } from "@/components/questionAndAnswer";
import type { Item } from "@/components/storyList";
import components from "@/designSystem/components.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import styles from "./styles.module.scss";

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
		</main>
	);
};
