import { QuestionAndAnswer } from "@/components/questionAndAnswer";
import button from "@/designSystem/components.module.scss";
import styles from "./styles.module.scss";

export type Props = {
	question: string;
	answer: string | null;
	onAnswerButtonClicked: () => void;
	onHintButtonClicked: (() => void) | null;
};

export const QuestionResult: React.FC<Props> = ({
	question,
	answer,
	onAnswerButtonClicked,
	onHintButtonClicked,
}) => {
	return (
		<section>
			<div className={styles.resultContainer}>
				<QuestionAndAnswer question={question} answer={answer} />
			</div>
			<div className={styles.buttonContainer}>
				<button className={button.button} onClick={onAnswerButtonClicked}>
					謎は解けましたか？
				</button>
				{onHintButtonClicked && (
					<button className={button.button2} onClick={onHintButtonClicked}>
						ヒントを見る
					</button>
				)}
			</div>
		</section>
	);
};
