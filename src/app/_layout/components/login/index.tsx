"use client";
import { signIn } from "next-auth/react";
import components from "@/styles/components.module.scss";

export const LoginButton = () => {
	return (
		<button
			className={components.buttonBrandFg}
			onClick={() => {
				signIn();
			}}
		>
			ログイン
		</button>
	);
};
