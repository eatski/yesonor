import styles from "./styles.module.scss";

export const MobileLimitation: React.FC<{}> = () => {
	return (
		<section className={styles.container}>
			<p>
				大変申し訳ございません。現在、一時的にスマートフォンからのご利用を制限させていただいております。
			</p>
		</section>
	);
};
