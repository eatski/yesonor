import React from "react";
import styles from "./styles.module.scss";

export type ToggleButtonProps = {
	id: string;
	onToggle: () => void;
	isOn: boolean;
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({
	id,
	isOn,
	onToggle,
}) => {
	return (
		<div
			id={id}
			className={`${styles.toggleSwitch} ${isOn ? styles.toggleSwitchOn : ""}`}
			onClick={onToggle}
			role="switch"
			aria-checked={isOn}
			tabIndex={0}
		>
			<div className={styles.toggleSwitchSlider} />
		</div>
	);
};
