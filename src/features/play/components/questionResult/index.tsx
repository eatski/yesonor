import styles from "./styles.module.scss";
import button from "@/styles/components.module.scss";
import { QuestionAndAnswer } from "@/common/components/questionAndAnswer";

export type Props = {
	question: string;
	answer: string | null;
	onAnswerButtonClicked: () => void;
	onHintButtonClicked: (() => void) | null;
};

export const QuestionResult: React.FC<Props> = (props) => {
	return (
		<section aria-label="質問の結果">
			<div className={styles.resultContainer}>
				<QuestionAndAnswer {...props} />
			</div>
			<div className={styles.buttonContainer}>
				<button className={button.button} onClick={props.onAnswerButtonClicked}>
					謎は解けましたか？
				</button>
				{props.onHintButtonClicked && (
					<button
						className={button.buttonDanger}
						onClick={props.onHintButtonClicked}
					>
						ヒントを見る
					</button>
				)}
			</div>
		</section>
	);
};
