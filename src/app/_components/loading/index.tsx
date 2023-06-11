import styles from "./styles.module.scss";
export const Loading = () => {
	return (
		<div className={styles.container}>
			<div className={styles.skelton}>
				<div className={styles.title} />
				<div className={styles.content} />
			</div>
		</div>
	);
};
