import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { PropsWithChildren, Suspense, useEffect, useState } from "react";
import { AiOutlineUnorderedList as MenuIcon } from "react-icons/ai";
import styles from "./styles.module.scss";
import components from "@/designSystem/components.module.scss";
import { useRouter } from "next/router";
import { Logo } from "./components/logo";
import { Menu, MenuItem, MenuButton, FocusableItem } from "@szhsin/react-menu";

export const Layout: React.FC<
	PropsWithChildren<{ upper?: React.ReactElement }>
> = ({ children, upper }) => {
	const session = useSession();

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
					{router.asPath !== "/stories/new" && session.data?.user && (
						<Link className={components.buttonBrandFg} href={"/stories/new"}>
							ストーリーを投稿
						</Link>
					)}
					{session.status !== "loading" ? (
						session.data?.user ? (
							<Menu
								menuButton={
									<MenuButton
										aria-label="メニュー"
										className={styles.iconWrapper}
									>
										<MenuIcon className={components.iconButtonBrandFg} />
									</MenuButton>
								}
							>
								<div className={styles.menu}>
									<FocusableItem>
										{({ ref }) => (
											<Link
												ref={ref}
												className={components.button0}
												href={"/my/stories"}
											>
												自分のストーリー
											</Link>
										)}
									</FocusableItem>
									<FocusableItem>
										{({ ref }) => (
											<Link
												ref={ref}
												className={components.button0}
												href={"/my/settings"}
											>
												設定
											</Link>
										)}
									</FocusableItem>
									<hr />
									<FocusableItem>
										{({ ref }) => (
											<button
												ref={ref}
												className={components.button0}
												onClick={() => {
													signOut();
												}}
											>
												ログアウト
											</button>
										)}
									</FocusableItem>
								</div>
							</Menu>
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

			{upper ? (
				<Suspense>
					<div className={styles.upper}>
						<div className={styles.content}>{upper}</div>
					</div>
				</Suspense>
			) : null}

			<div className={styles.main}>{children}</div>
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
