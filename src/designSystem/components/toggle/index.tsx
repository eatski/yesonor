import React from "react";
import styles from "./styles.module.scss";

export type ToggleButtonProps = {
	onToggle: () => void;
	isOn: boolean;
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({
	isOn,
	onToggle,
}) => {
	return (
		<div
			className={`${styles.toggleSwitch} ${isOn ? styles.toggleSwitchOn : ""}`}
			onClick={onToggle}
			role="checkbox"
			aria-checked={isOn}
			tabIndex={0}
		>
			<div className={styles.toggleSwitchSlider} />
		</div>
	);
};

export const ToggleWithLabel: React.FC<ToggleButtonProps & { label: string }> =
	({ label, ...props }) => {
		return (
			<div className={styles.toggleWithLabel}>
				<ToggleButton {...props} />
				<span className={styles.toggleLabel}>{label}</span>
			</div>
		);
	};
