import components from "@/designSystem/components.module.scss";
import React from "react";

export const Input: React.FC<{
	originalProps: Omit<
		React.DetailedHTMLProps<
			React.InputHTMLAttributes<HTMLInputElement>,
			HTMLInputElement
		>,
		"className"
	>;
}> = (props) => {
	return <input {...props.originalProps} className={components.input} />;
};
