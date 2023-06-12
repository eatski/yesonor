import { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export const UpperArea: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className={styles.container}>
			<div className={styles.content}>{children}</div>
		</div>
	);
};
