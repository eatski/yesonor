import components from "@/designSystem/components.module.scss";
import { signIn } from "next-auth/react";
import styles from "./styles.module.scss";

export const RequireLogin: React.FC<{}> = () => {
	return (
		<section className={styles.container}>
			<p>
				一時的にログインされていない方の利用を制限させていただいております。
			</p>
			<div>
				<button
					className={components.button}
					onClick={() => {
						signIn();
					}}
				>
					ログイン
				</button>
			</div>
		</section>
	);
};
