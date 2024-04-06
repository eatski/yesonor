import { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export const InformationParagragh: React.FC<
	PropsWithChildren<{
		size?: "small" | "medium";
	}>
> = ({ children, size = "medium" }) => {
	return (
		<p className={styles.container} data-size={size}>
			{children}
		</p>
	);
};
