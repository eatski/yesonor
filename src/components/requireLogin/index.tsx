import { gtagEvent } from "@/common/util/gtag";
import components from "@/designSystem/components.module.scss";
import { signIn } from "next-auth/react";
import styles from "./styles.module.scss";

export const RequireLogin: React.FC<{}> = () => {
	return (
		<aside className={styles.container}>
			<p>ログインをすると以下のことができるようになります。</p>
			<ul>
				<li>自作のストーリーを投稿</li>
			</ul>
			<div>
				<button
					className={components.button}
					onClick={() => {
						gtagEvent("click_login_recommend");
						signIn();
					}}
				>
					ログイン
				</button>
			</div>
		</aside>
	);
};
