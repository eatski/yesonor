import React from "react";
import styles from "./styles.module.scss";

type Option = {
	value: string;
	label: string;
};

export const Select: React.FC<{
	originalProps: Omit<
		React.DetailedHTMLProps<
			React.SelectHTMLAttributes<HTMLSelectElement>,
			HTMLSelectElement
		>,
		"children"
	>;
	options: Option[];
}> = ({ options, originalProps }) => {
	return (
		<div className={styles.selectWrapper}>
			<select {...originalProps}>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};
