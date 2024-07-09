import components from "@/designSystem/components.module.scss";
import { AiOutlineUnorderedList as Icon } from "react-icons/ai";

export const MenuIcon = ({ loading }: { loading: boolean }) => {
	return <Icon className={components.iconButtonBrandFg} />;
};
