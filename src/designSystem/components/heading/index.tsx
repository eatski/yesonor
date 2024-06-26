import type { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export const H1: React.FC<PropsWithChildren> = ({ children }) => {
	return <h1 className={styles.container}>{children}</h1>;
};

export const H2: React.FC<PropsWithChildren<{ label?: string }>> = ({
	label,
	children,
}) => {
	return <h2 className={styles.container}>{label || children}</h2>;
};
