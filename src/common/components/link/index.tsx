import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

const Link = (
	props: DetailedHTMLProps<
		AnchorHTMLAttributes<HTMLAnchorElement>,
		HTMLAnchorElement
	>,
) => {
	return <a {...props} />;
};
export default Link;
