import components from "@/designSystem/components.module.scss";
import React from "react";

export const Input: React.FC<
	Omit<
		React.DetailedHTMLProps<
			React.InputHTMLAttributes<HTMLInputElement>,
			HTMLInputElement
		>,
		"className"
	>
> = (props) => {
	return <input {...props} className={components.input} />;
};
