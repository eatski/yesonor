import { AiFillRobot, AiOutlineComment } from "react-icons/ai";
import { TypingText } from "../../designSystem/components/typing";
import styles from "./styles.module.scss";

type Props = {
	question: string;
	answer: string | null;
	onQuestionTypingEnd?: () => void;
};

export const QuestionAndAnswer: React.FC<Props> = (props) => {
	return (
		<div className={styles.container}>
			<p className={styles.row}>
				<div className={styles.iconWrapper}>
					<AiOutlineComment role="img" aria-label="あなたの質問" />
				</div>
				<div className={styles.text}>
					<TypingText onTypingEnd={props.onQuestionTypingEnd}>
						{props.question}
					</TypingText>
				</div>
			</p>
			<hr />
			<p className={styles.row} role="status" aria-busy={props.answer === null}>
				<div className={styles.iconWrapper}>
					<AiFillRobot role="img" aria-label="AIからの回答" />
				</div>
				<div className={styles.text}>
					{!props.answer ? (
						"考え中..."
					) : (
						<TypingText>{props.answer}</TypingText>
					)}
				</div>
			</p>
		</div>
	);
};
