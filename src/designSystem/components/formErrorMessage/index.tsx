import type { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export const FormErrorMessage: React.FC<PropsWithChildren<{ id: string }>> = ({
	children,
	id,
}) => {
	return (
		<p id={id} className={styles.container}>
			{children}
		</p>
	);
};
