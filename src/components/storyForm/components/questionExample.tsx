import { IconButton } from "@/designSystem/components/button";
import { FormErrorMessage } from "@/designSystem/components/formErrorMessage";
import { Input } from "@/designSystem/components/input";
import { Select } from "@/designSystem/components/select";
import { type HTMLProps, useId } from "react";
import { AiOutlineMinusCircle } from "react-icons/ai";
import styles from "./styles.module.scss";

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
				<div className={styles.headRight}>
					<IconButton
						color="danger"
						aria-label="この質問例を削除"
						onClick={onClickRemove}
					>
						<AiOutlineMinusCircle />
					</IconButton>
				</div>
			</div>
			<div className={styles.field}>
				<label>
					質問
					<Input
						originalProps={{
							...questionInput,
							placeholder: "例: 太郎さんはオシャレ好きですか？",
							"aria-errormessage": questionFormErrorMessageId,
						}}
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
					<Select
						originalProps={answerInput}
						options={[
							{ value: "True", label: "はい" },
							{ value: "False", label: "いいえ" },
							{ value: "Unknown", label: "わからない" },
						]}
					></Select>
				</label>
			</div>
			<div className={styles.field}>
				<label>
					カスタムメッセージ
					<Input
						originalProps={{
							...customMessageInput,
							placeholder: "例: いい質問です！オシャレ好きです。",
							"aria-errormessage": customMessageFormErrorMessageId,
						}}
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
