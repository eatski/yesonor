import { gtagEvent } from "@/common/util/gtag";
import { Button } from "@/designSystem/components/button";
import { Input } from "@/designSystem/components/input";
import type React from "react";
import { useId, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import styles from "./styles.module.scss";

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
					gtagEvent("click_submit_question");
					onSubmit(inputValue);
					setInputValue(""); // reset form input after submission
				}
			}}
		>
			<label htmlFor={questionInputId} className={styles.formLabel}>
				AIへの質問
			</label>
			<div className={styles.formContent}>
				<Input
					id={questionInputId}
					required
					placeholder="はい or いいえ で答えられる質問"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<Button
					color="primary"
					size="medium"
					disabled={isLoading}
					aria-label="質問を送信"
				>
					<AiOutlineSend size={"16px"} />
				</Button>
			</div>
		</form>
	);
};
