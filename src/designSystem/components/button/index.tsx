import type React from "react";
import styles from "./styles.module.scss";

type ButtonProps = {
	color: "zero" | "primary" | "secondary" | "none" | "brand";
	size: "small" | "medium" | "large";
	width?: "auto" | "full";
};

export const Button: React.FC<
	React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> &
		ButtonProps
> = ({ children, className, color, size, width, ...props }) => {
	return (
		<button
			type={"button"}
			{...props}
			data-color={color}
			data-size={size}
			data-width={width}
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
	> &
		ButtonProps
> = ({ children, className, color, size, width, ...props }) => {
	return (
		<a
			{...props}
			data-color={color}
			data-size={size}
			data-width={width}
			className={styles.button}
		>
			{children}
		</a>
	);
};

export const GenericButton: React.FC<
	React.DetailedHTMLProps<
		React.AnchorHTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	> &
		ButtonProps
> = ({ children, className, color, size, width, ...props }) => {
	return (
		<div
			{...props}
			data-color={color}
			data-size={size}
			data-width={width}
			className={styles.button}
		>
			{children}
		</div>
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
