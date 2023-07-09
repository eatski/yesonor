import React, { useId, useRef } from "react";
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
	return (
		<form
			className={styles.form}
			onSubmit={(e) => {
				e.preventDefault();
				if (e.target instanceof HTMLFormElement && e.target.checkValidity()) {
					onSubmit(inputRef.current);
				}
			}}
		>
			<label htmlFor={answerInputId} className={styles.formLabel}>
				あなたの推理
			</label>
			<textarea
				required
				id={answerInputId}
				className={components.textarea}
				onChange={(e) => {
					inputRef.current = e.target.value;
				}}
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
