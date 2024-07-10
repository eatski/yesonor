import styles from "./styles.module.scss";

export const Loading = () => {
	return (
		<div className={styles.loading}>
			<div className={styles.spinner}></div>
		</div>
	);
};
