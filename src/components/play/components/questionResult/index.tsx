import { QuestionAndAnswer } from "@/components/questionAndAnswer";
import { Button } from "@/designSystem/components/button";
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
				<Button color="primary" size="medium" onClick={onAnswerButtonClicked}>
					謎は解けましたか？
				</Button>
				{onHintButtonClicked && (
					<Button color="secondary" size="medium" onClick={onHintButtonClicked}>
						ヒントを見る
					</Button>
				)}
			</div>
		</section>
	);
};
