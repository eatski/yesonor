import { AiFillPushpin } from "react-icons/ai";
import styles from "./styles.module.scss";
import {
	AnchorButton,
	ButtonIconWrapper,
} from "@/designSystem/components/button";

const PinnedItem = () => {
	return (
		<AnchorButton
			color="none"
			href="https://github.com/eatski/yesonor/issues/129"
			size={"large"}
		>
			<ButtonIconWrapper>
				<AiFillPushpin />
			</ButtonIconWrapper>
			当サービスの現在の状況につきまして
		</AnchorButton>
	);
};

export const PinnedInfo = () => {
	return (
		<div className={styles.container}>
			<PinnedItem />
		</div>
	);
};
