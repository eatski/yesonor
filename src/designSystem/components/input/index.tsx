import React from "react";
import styles from "./styles.module.scss";

export const Input: React.FC<{
	originalProps: Omit<
		React.DetailedHTMLProps<
			React.InputHTMLAttributes<HTMLInputElement>,
			HTMLInputElement
		>,
		"className"
	>;
}> = (props) => {
	return <input {...props.originalProps} className={styles.input} />;
};
