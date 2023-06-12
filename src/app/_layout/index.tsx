import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { PropsWithChildren } from "react";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import { Logo } from "./components/logo";
import { getUserSession } from "@/server/serverComponent/getUserSession";
import { Menu } from "./components/menu";
import { LoginButton } from "./components/login";

export const Layout = async ({ children }: PropsWithChildren) => {
	const session = await getUserSession();
	return (
		<>
			<header className={styles.header}>
				<Link href="/">
					<h1>
						<Logo />
					</h1>
				</Link>
				<div className={styles.right}>
					{session && (
						<Link className={components.buttonBrandFg} href={"/stories/new"}>
							ストーリーを投稿
						</Link>
					)}
					{session ? <Menu /> : <LoginButton />}
				</div>
			</header>
			{children}
			<footer className={styles.footer}>
				<Logo />
				<div className={styles.footerLinks}>
					<Link href="/terms">利用規約</Link>
					<Link href="/privacy">プライバシーポリシー</Link>
					<Link href="/about">当サイトについて</Link>
					<a href="https://github.com/eatski/yesonor">ソースコード</a>
				</div>
			</footer>
		</>
	);
};
