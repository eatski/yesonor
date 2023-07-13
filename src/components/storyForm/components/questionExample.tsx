import { HTMLProps } from "react";
import { AiOutlineMinusCircle } from "react-icons/ai";
import styles from "./styles.module.scss";
import components from "@/designSystem/components.module.scss";

export type Props = {
	index: number;
	questionInput: HTMLProps<HTMLInputElement>;
	questionError: string | null;
	answerInput: HTMLProps<HTMLSelectElement>;
	customMessageInput: HTMLProps<HTMLInputElement>;
	customMessageError: string | null;
	onClickRemove: () => void;
};

export const QuestionExampleForm = ({
	index,
	questionInput,
	questionError,
	answerInput,
	customMessageInput,
	customMessageError,
	onClickRemove,
}: Props) => {
	return (
		<div key={index} className={styles.container}>
			<div className={styles.head}>
				Q{index + 1}:
				<button
					aria-label="この質問例を削除"
					type="button"
					onClick={onClickRemove}
				>
					<AiOutlineMinusCircle className={components.iconButtonDanger} />
				</button>
			</div>
			<div className={styles.field}>
				<label>
					質問
					<input
						{...questionInput}
						placeholder="例: 太郎さんはオシャレ好きですか？"
						className={components.input}
					/>
					{questionError && (
						<p className={components.formErrorMessage}>{questionError}</p>
					)}
				</label>
			</div>
			<div className={styles.field}>
				<label>
					回答
					<div className={components.selectWrapper}>
						<select {...answerInput}>
							<option value="True">はい</option>
							<option value="False">いいえ</option>
							<option value="Unknown">わからない</option>
						</select>
					</div>
				</label>
			</div>
			<div className={styles.field}>
				<label>
					カスタムメッセージ
					<input
						{...customMessageInput}
						placeholder="例: いい質問です！オシャレ好きです。"
						className={components.input}
					/>
					{customMessageError && (
						<p className={components.formErrorMessage}>{customMessageError}</p>
					)}
				</label>
			</div>
		</div>
	);
};
