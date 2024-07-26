import { IconButton } from "@/designSystem/components/button";
import React from "react";
import { AiOutlineClose as Icon } from "react-icons/ai";
import styles from "./styles.module.scss";

export const ToastMessage: React.FC<{
	text: string;
	onDeleteClick: () => void;
}> = ({ text, onDeleteClick }) => {
	return (
		<div className={styles.toast}>
			<p role="log" aria-live="polite">
				{text}
			</p>
			<div className={styles.iconButtonContainer}>
				<IconButton color="zero" onClick={onDeleteClick} aria-label="閉じる">
					<Icon />
				</IconButton>
			</div>
		</div>
	);
};
