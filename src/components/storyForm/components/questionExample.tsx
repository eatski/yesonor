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
	const uniqueId = useId();
	const getFieldId = (name: string, type: "err" | "input") =>
		`${uniqueId}-${name}-${type}`;
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
				<label htmlFor={getFieldId("question", "input")}>質問</label>
				<Input
					originalProps={{
						...questionInput,
						id: getFieldId("question", "input"),
						placeholder: "例: 太郎さんはオシャレ好きですか？",
						"aria-errormessage": questionError
							? getFieldId("question", "err")
							: undefined,
					}}
				/>
				{questionError && (
					<FormErrorMessage id={getFieldId("question", "err")}>
						{questionError}
					</FormErrorMessage>
				)}
			</div>
			<div className={styles.field}>
				<label htmlFor={getFieldId("answer", "input")}>回答</label>
				<Select
					originalProps={{
						id: getFieldId("answer", "input"),
						...answerInput,
					}}
					options={[
						{ value: "True", label: "はい" },
						{ value: "False", label: "いいえ" },
						{ value: "Unknown", label: "わからない" },
					]}
				></Select>
			</div>
			<div className={styles.field}>
				<label htmlFor={getFieldId("customMessage", "input")}>
					カスタムメッセージ
				</label>
				<Input
					originalProps={{
						...customMessageInput,
						id: getFieldId("customMessage", "input"),
						placeholder: "例: いい質問です！オシャレ好きです。",
						"aria-errormessage": customMessageError
							? getFieldId("customMessage", "err")
							: undefined,
					}}
				/>
				{customMessageError && (
					<FormErrorMessage id={getFieldId("customMessage", "err")}>
						{customMessageError}
					</FormErrorMessage>
				)}
			</div>
		</div>
	);
};
