import { PropsWithChildren } from "react";
import styles from "./styles.module.scss";
export const H2: React.FC<PropsWithChildren<{ label?: string }>> = ({
	label,
	children,
}) => {
	return <h2 className={styles.container}>{label || children}</h2>;
};
