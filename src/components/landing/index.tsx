/* eslint-disable @next/next/no-img-element */
import { brand } from "@/common/texts";
import { GenericButton } from "@/designSystem/components/button";
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
				<Link href="/situationPuzzle">
					<GenericButton color="none" size="medium">
						水平思考クイズとは？
					</GenericButton>
				</Link>
				<Link href="/sponsor">
					<GenericButton color="none" size="medium">
						ご支援のお願い
					</GenericButton>
				</Link>
			</div>
		</div>
	);
};
