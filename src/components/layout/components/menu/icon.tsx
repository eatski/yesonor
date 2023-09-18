import { AiOutlineUnorderedList as Icon } from "react-icons/ai";
import components from "@/designSystem/components.module.scss";

export const MenuIcon = ({ loading }: { loading: boolean }) => {
	return <Icon className={components.iconButtonBrandFg} />;
};
