"use client";
import components from "@/designSystem/components.module.scss";
import { FocusableItem, Menu, MenuButton } from "@szhsin/react-menu";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { MenuIcon } from "./icon";
import styles from "./styles.module.scss";

const UserMenu: React.FC<{ userId: string | null }> = ({ userId }) => {
	return userId ? (
		<Menu
			menuButton={
				<MenuButton aria-label="メニュー" className={styles.buttonReset}>
					<MenuIcon loading={false} />
				</MenuButton>
			}
		>
			<div className={styles.menu}>
				<FocusableItem>
					{({ ref }) => (
						<Link
							ref={ref}
							className={components.button0}
							href={`/users/${userId}/stories`}
						>
							自分のストーリー
						</Link>
					)}
				</FocusableItem>
				<FocusableItem>
					{({ ref }) => (
						<Link ref={ref} className={components.button0} href={"/settings"}>
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
	);
};

export default UserMenu;
