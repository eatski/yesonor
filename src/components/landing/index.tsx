/* eslint-disable @next/next/no-img-element */
import { brand } from "@/common/texts";
import components from "@/designSystem/components.module.scss";
import Link from "next/link";
import styles from "./styles.module.scss";

export const Landing: React.FC = () => {
	return (
		<div className={styles.container}>
			<h1>{brand.serviceName}</h1>
			<p>
				{brand.serviceName}({brand.serviceNickname})は{brand.serviceDescription}
			</p>
			<div className={styles.buttons}>
				<Link href="/situationPuzzle" className={components.buttonLink}>
					水平思考クイズとは？
				</Link>
				<Link href="/sponsor" className={components.buttonLink}>
					ご支援のお願い
				</Link>
			</div>
		</div>
	);
};
