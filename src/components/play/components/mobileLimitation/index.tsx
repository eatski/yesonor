import styles from "./styles.module.scss";

export const MobileLimitation: React.FC<{}> = () => {
	return (
		<section className={styles.container}>
			<p>
				大変申し訳ございません。一時的にスマートフォンからの利用を制限させていただいております。
			</p>
		</section>
	);
};
