import type { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export const H1: React.FC<PropsWithChildren> = ({ children }) => {
	return <h1 className={styles.container}>{children}</h1>;
};

export const H2: React.FC<
	PropsWithChildren<{ label?: string; id?: string }>
> = ({ id, label, children }) => {
	return (
		<h2 id={id} className={styles.container}>
			{label || children}
		</h2>
	);
};

export type LayoutLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const Heading: React.FC<
	PropsWithChildren<{
		id?: string;
		level: LayoutLevel;
	}>
> = ({ level, id, children }) => {
	const Tag = `h${level}` as keyof JSX.IntrinsicElements;
	return (
		<Tag id={id} className={styles.headingFuture}>
			{children}
		</Tag>
	);
};
