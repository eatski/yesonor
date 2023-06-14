"use client";
import Link from "@/common/components/link";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { AiOutlineUnorderedList as MenuIcon } from "react-icons/ai";

export const Menu = () => {
	const [menuOpen, setMenuOpen] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);
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
			<button
				aria-label="メニュー"
				className={styles.iconWrapper}
				onClick={() => {
					setMenuOpen((flg) => !flg);
				}}
			>
				<MenuIcon className={components.iconButtonBrandFg} />
			</button>
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
		</>
	);
};
