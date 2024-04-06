import React, { useCallback, useId, useRef } from "react";
import styles from "./styles.module.scss";
import components from "@/designSystem/components.module.scss";

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
				<button
					className={components.buttonLink}
					type="button"
					onClick={onCancel}
					disabled={isLoading}
					data-width="medium"
				>
					まだわからない
				</button>
				<button
					className={components.button}
					type="submit"
					disabled={isLoading}
					data-width="medium"
				>
					回答する
				</button>
			</div>
			{isError && <p className={styles.error}>エラーが発生しました。</p>}
		</form>
	);
};
