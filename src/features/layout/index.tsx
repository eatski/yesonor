import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { AiOutlineUnorderedList as Menu } from "react-icons/ai";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import { useRouter } from "next/router";
import { Logo } from "./components/logo";

export const Layout: React.FC<
	PropsWithChildren<{ upper?: React.ReactElement }>
> = ({ children, upper }) => {
	const session = useSession();
	const [menuOpen, setMenuOpen] = useState<boolean>(false);
	const ref = React.useRef<HTMLDivElement>(null);
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

	useEffect(() => {
		const listener = (e: MouseEvent) => {
			if (e.target instanceof HTMLElement) {
				if (ref.current?.contains(e.target)) {
					return;
				}
				setMenuOpen(false);
			}
		};
		document.addEventListener("click", listener);
		return () => {
			document.removeEventListener("click", listener);
		};
	}, [menuOpen]);
	return (
		<>
			<header className={styles.header}>
				<Link href="/">
					<h1>
						<Logo />
					</h1>
				</Link>
				<div className={styles.right}>
					{router.asPath !== "/stories/new" && session.data?.user && (
						<Link className={components.buttonBrandFg} href={"/stories/new"}>
							ストーリーを投稿
						</Link>
					)}
					{session.status !== "loading" ? (
						session.data?.user ? (
							<button
								aria-label="メニュー"
								className={styles.iconWrapper}
								onClick={() => {
									setMenuOpen((flg) => !flg);
								}}
							>
								<Menu className={components.iconButtonBrandFg} />
							</button>
						) : (
							<button
								className={components.buttonBrandFg}
								onClick={() => {
									signIn();
								}}
							>
								ログイン
							</button>
						)
					) : null}
				</div>
			</header>
			{loading && <div className={styles.transitionStatus} />}
			{menuOpen && (
				<div className={styles.menu} ref={ref}>
					<Link className={components.button0} href={"/my/stories"}>
						自分のストーリー
					</Link>
					<Link className={components.button0} href={"/my/settings"}>
						設定
					</Link>
					<hr />
					<button
						className={components.button0}
						onClick={() => {
							signOut();
						}}
					>
						ログアウト
					</button>
				</div>
			)}
			{upper ? (
				<div className={styles.upper}>
					<div className={styles.content}>{upper}</div>
				</div>
			) : null}

			<main className={styles.main}>{children}</main>
			<footer className={styles.footer}>
				<Logo />
				<div className={styles.footerLinks}>
					<Link href="/terms">利用規約</Link>
					<Link href="/privacy">プライバシーポリシー</Link>
					<Link href="/about">サイトについて</Link>
					<a href="https://github.com/eatski/yesonor">開発</a>
				</div>
			</footer>
		</>
	);
};
