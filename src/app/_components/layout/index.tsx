import { Logo } from "@/app/_components/layout/components/logo";
import { PinnedInfo } from "@/app/_components/layout/components/pinned";
import { GenericButton } from "@/designSystem/components/button";
import Link from "next/link";
import type React from "react";
import { type PropsWithChildren } from "react";
import { UserMenu } from "./components/menu";
import styles from "./styles.module.scss";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<header className={styles.header}>
				<Link href="/">
					<Logo />
				</Link>
				<div className={styles.right}>
					<Link href={"/stories/new"}>
						<GenericButton color={"brand"} size={"medium"}>
							ストーリーを投稿
						</GenericButton>
					</Link>
					<UserMenu />
				</div>
			</header>
			<PinnedInfo />

			<div className={styles.main}>{children}</div>
			<footer className={styles.footer}>
				<div className={styles.footerLinks}>
					<Link href="/terms">利用規約</Link>
					<Link href="/privacy">プライバシーポリシー</Link>
					<Link href="/about">サイトについて</Link>
					<Link href="/sponsor">ご支援のお願い</Link>
				</div>
			</footer>
		</>
	);
};
