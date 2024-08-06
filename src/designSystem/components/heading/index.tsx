import type { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export type LayoutLevel = 1 | 2 | 3 | 4 | 5 | 6;

const levelToSize = {
	1: "large",
	2: "large",
	3: "medium",
	4: "small",
	5: "small",
	6: "small",
} as const;

export const Heading: React.FC<
	PropsWithChildren<{
		id?: string;
		level: LayoutLevel;
		size?: "small" | "medium" | "large";
	}>
> = ({ level, id, children, size }) => {
	const Tag = `h${level}` as const;
	return (
		<Tag
			id={id}
			className={styles.headingFuture}
			data-size={size || levelToSize[level]}
		>
			{children}
		</Tag>
	);
};
