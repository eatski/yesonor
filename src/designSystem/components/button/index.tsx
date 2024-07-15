import type React from "react";
import styles from "./styles.module.scss";

export const Button: React.FC<
	React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> & {
		color: "zero" | "primary" | "secondary" | "none";
		size: "small" | "medium" | "large";
	}
> = ({ children, className, color, size, ...props }) => {
	return (
		<button
			type={"button"}
			{...props}
			data-color={color}
			data-size={size}
			className={styles.button}
		>
			{children}
		</button>
	);
};

export const AnchorButton: React.FC<
	React.DetailedHTMLProps<
		React.AnchorHTMLAttributes<HTMLAnchorElement>,
		HTMLAnchorElement
	> & {
		color: "zero" | "primary" | "secondary" | "none";
		size: "small" | "medium" | "large";
	}
> = ({ children, className, color, size, ...props }) => {
	return (
		<a {...props} data-color={color} data-size={size} className={styles.button}>
			{children}
		</a>
	);
};

export const ButtonIconWrapper: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	return <span className={styles.iconWrapper}>{children}</span>;
};

export const IconButton: React.FC<
	React.PropsWithChildren<
		React.DetailedHTMLProps<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			HTMLButtonElement
		>
	>
> = ({ children, className, ...props }) => {
	return (
		<button type={"button"} {...props} className={styles.iconButton}>
			{children}
		</button>
	);
};
