"use client";
import { Button, GenericButton } from "@/designSystem/components/button";
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
						<Link ref={ref} href={`/users/${userId}/stories`}>
							<GenericButton color="zero" size="medium" width="full">
								自分のストーリー
							</GenericButton>
						</Link>
					)}
				</FocusableItem>
				<FocusableItem>
					{({ ref }) => (
						<Link ref={ref} href={"/settings"}>
							<GenericButton color="zero" size="medium" width="full">
								設定
							</GenericButton>
						</Link>
					)}
				</FocusableItem>
				<hr />
				<FocusableItem>
					{({ ref }) => (
						<Button
							ref={ref}
							onClick={() => {
								signOut();
							}}
							color="zero"
							size="medium"
						>
							ログアウト
						</Button>
					)}
				</FocusableItem>
			</div>
		</Menu>
	) : (
		<Button
			color="brand"
			size="medium"
			onClick={() => {
				signIn();
			}}
		>
			ログイン
		</Button>
	);
};

export default UserMenu;
