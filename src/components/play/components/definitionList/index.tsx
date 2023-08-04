import React, { PropsWithChildren } from "react";
import styles from "./styles.module.scss";
export const DefinitionList: React.FC<PropsWithChildren> = ({ children }) => {
	return <dl className={styles.container}>{children}</dl>;
};
