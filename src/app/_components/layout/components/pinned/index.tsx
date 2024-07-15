import {
	AnchorButton,
	ButtonIconWrapper,
} from "@/designSystem/components/button";
import { AiFillPushpin } from "react-icons/ai";
import styles from "./styles.module.scss";

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
		// <div className={styles.container}>
		// 	<PinnedItem
		// 		title={"サービス維持のためのご支援のお願い"}
		// 		href={"https://note.com/eatski/n/n11b50b9439b1"}
		// 	/>
		// </div>
		null
	);
};
