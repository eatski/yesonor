import React from "react";
import styles from "./styles.module.scss";

export const TextArea: React.FC<{
	originalProps: Omit<
		React.DetailedHTMLProps<
			React.TextareaHTMLAttributes<HTMLTextAreaElement>,
			HTMLTextAreaElement
		>,
		"className"
	>;
}> = (props) => {
	return <textarea {...props.originalProps} className={styles.textarea} />;
};
