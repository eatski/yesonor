import { HTMLProps, useId } from "react";
import { AiOutlineMinusCircle } from "react-icons/ai";
import styles from "./styles.module.scss";
import components from "@/designSystem/components.module.scss";
import { FormErrorMessage } from "@/designSystem/components/formErrorMessage";

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
	const questionFormErrorMessageId = useId();
	const customMessageFormErrorMessageId = useId();
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
						aria-errormessage={questionFormErrorMessageId}
					/>
					{questionError && (
						<FormErrorMessage id={questionFormErrorMessageId}>
							{questionError}
						</FormErrorMessage>
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
						aria-errormessage={customMessageFormErrorMessageId}
					/>
					{customMessageError && (
						<FormErrorMessage id={customMessageFormErrorMessageId}>
							{customMessageError}
						</FormErrorMessage>
					)}
				</label>
			</div>
		</div>
	);
};
