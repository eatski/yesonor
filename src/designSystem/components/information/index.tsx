import { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export const InformationParagragh: React.FC<PropsWithChildren> = ({
	children,
}) => {
	return <p className={styles.container}>{children}</p>;
};
