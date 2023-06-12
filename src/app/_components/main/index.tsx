import React, { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export const MainContent: React.FC<PropsWithChildren> = ({ children }) => {
	return <main className={styles.main}>{children}</main>;
};
