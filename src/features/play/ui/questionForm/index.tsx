import React, { useId, useState } from "react";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import { AiOutlineSend } from "react-icons/ai";
import { gtag } from "@/common/util/gtag";

export const QuestionForm: React.FC<{
	onSubmit: (text: string) => void;
	isLoading: boolean;
}> = ({ isLoading, onSubmit }) => {
	const [inputValue, setInputValue] = useState("");
	const questionInputId = useId();
	return (
		<form
			className={styles.container}
			onSubmit={(e) => {
				e.preventDefault();
				if (e.target instanceof HTMLFormElement && e.target.checkValidity()) {
					gtag("click_submit_question");
					onSubmit(inputValue);
					setInputValue(""); // reset form input after submission
				}
			}}
		>
			<label htmlFor={questionInputId} className={styles.formLabel}>
				AIに質問をする
			</label>
			<div className={styles.formContent}>
				<input
					id={questionInputId}
					className={components.input}
					required
					placeholder="はい or いいえ で答えられる質問"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<button
					className={components.button}
					type="submit"
					disabled={isLoading}
					aria-label="質問を送信"
				>
					<AiOutlineSend size={"16px"} />
				</button>
			</div>
		</form>
	);
};
