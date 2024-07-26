import components from "@/designSystem/components.module.scss";
import { Button } from "@/designSystem/components/button";
import type React from "react";
import { useCallback, useId, useRef } from "react";
import styles from "./styles.module.scss";

export const AnswerForm: React.FC<{
	onSubmit: (text: string) => void;
	onCancel: () => void;
	isLoading: boolean;
	isError: boolean;
}> = ({ isLoading, onSubmit, onCancel, isError }) => {
	const inputRef = useRef<string>("");
	const answerInputId = useId();
	const onSubmitHandler = useCallback<React.FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault();
			if (e.target instanceof HTMLFormElement && e.target.checkValidity()) {
				onSubmit(inputRef.current);
			}
		},
		[onSubmit],
	);
	const onChangeHandler = useCallback<
		React.ChangeEventHandler<HTMLTextAreaElement>
	>((e) => {
		inputRef.current = e.target.value;
	}, []);
	return (
		<form className={styles.form} onSubmit={onSubmitHandler}>
			<label htmlFor={answerInputId} className={styles.formLabel}>
				あなたの推理
			</label>
			<textarea
				required
				id={answerInputId}
				className={components.textarea}
				placeholder="あなたが推理した物語の真相"
				onChange={onChangeHandler}
			/>
			<div className={styles.buttonContainer}>
				<div className={styles.buttonItem}>
					<Button
						onClick={onCancel}
						disabled={isLoading}
						color="none"
						size="medium"
						width="full"
					>
						まだわからない
					</Button>
				</div>
				<div className={styles.buttonItem}>
					<Button
						type="submit"
						disabled={isLoading}
						color="primary"
						size="medium"
						width="full"
					>
						回答する
					</Button>
				</div>
			</div>
			{isError && <p className={styles.error}>エラーが発生しました。</p>}
		</form>
	);
};
