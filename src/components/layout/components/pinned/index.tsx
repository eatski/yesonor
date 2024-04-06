import { AiFillPushpin } from "react-icons/ai";
import styles from "./styles.module.scss";
import {
	AnchorButton,
	ButtonIconWrapper,
} from "@/designSystem/components/button";

const PinnedItem = ({
	title,
	href,
}: {
	title: string;
	href: string;
}) => {
	return (
		<AnchorButton color="none" href={href} size={"large"}>
			<ButtonIconWrapper>
				<AiFillPushpin />
			</ButtonIconWrapper>
			{title}
		</AnchorButton>
	);
};

export const PinnedInfo = () => {
	return (
		<div className={styles.container}>
			<PinnedItem
				title={"当サービスの現在の状況につきまして"}
				href={"https://github.com/eatski/yesonor/issues/129"}
			/>
			<PinnedItem
				title={"サービス維持のためのご支援のお願い"}
				href={"https://note.com/eatski/n/n11b50b9439b1"}
			/>
		</div>
	);
};
