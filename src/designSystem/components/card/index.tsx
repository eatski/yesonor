import { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export const Card: React.FC<PropsWithChildren<{ variant?: "success" }>> = ({
	children,
	variant,
}) => {
	return (
		<section data-variant={variant} className={styles.container}>
			{children}
		</section>
	);
};
