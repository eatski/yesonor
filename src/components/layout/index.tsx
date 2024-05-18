import components from "@/designSystem/components.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import type React from "react";
import { type PropsWithChildren, Suspense, useEffect, useState } from "react";
import { Logo } from "./components/logo";
import { UserMenu } from "./components/menu";
import { PinnedInfo } from "./components/pinned";
import styles from "./styles.module.scss";

export const Layout: React.FC<
	PropsWithChildren<{ upper?: React.ReactElement }>
> = ({ children, upper }) => {
	const router = useRouter();

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const onStart = () => {
			setLoading(true);
		};
		const onEnd = () => {
			setLoading(false);
		};
		router.events.on("routeChangeStart", onStart);
		router.events.on("routeChangeComplete", onEnd);
		router.events.on("routeChangeError", onEnd);
		return () => {
			router.events.off("routeChangeStart", onStart);
			router.events.off("routeChangeComplete", onEnd);
			router.events.off("routeChangeError", onEnd);
		};
	}, [router]);
	return (
		<>
			<header className={styles.header}>
				<Link href="/">
					<Logo />
				</Link>
				<div className={styles.right}>
					<Link className={components.buttonBrandFg} href={"/stories/new"}>
						ストーリーを投稿
					</Link>
					<UserMenu />
				</div>
			</header>
			{loading && <div className={styles.transitionStatus} />}
			<PinnedInfo />

			{upper ? (
				<Suspense>
					<div className={styles.upper}>
						<div className={styles.content}>{upper}</div>
					</div>
				</Suspense>
			) : null}

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
