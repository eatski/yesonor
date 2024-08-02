"use client";
import { Button } from "@/designSystem/components/button";
import { Heading } from "@/designSystem/components/heading";
import { Input } from "@/designSystem/components/input";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import type React from "react";
import { useState } from "react";
import { useConfirmModal } from "../confirmModal";
import { useToast } from "../toast";
import styles from "./styles.module.scss";

export type Props = {
	name: string | null;
	email: string;
	changeName: (name: string) => Promise<void>;
	deleteUser: () => Promise<void>;
};

const LoginInfo = ({ email }: Pick<Props, "email">) => {
	return (
		<section>
			<h2>ログイン情報</h2>
			<div className={styles.row}>
				<div className={styles.left}>
					<p className={styles.small}>
						<strong>{email}</strong>でログインしています。
					</p>
				</div>
			</div>
		</section>
	);
};

const Name: React.FC<Pick<Props, "changeName" | "name">> = ({
	name,
	changeName,
}) => {
	type EditingState =
		| { inputValue: string; isEditing: true }
		| { isEditing: false };

	const [editingState, setEditingState] = useState<EditingState>({
		isEditing: false,
	});
	const { mutateAsync, isLoading } = useMutation(changeName);

	return (
		<section>
			<h2>表示名</h2>
			<div>
				{editingState.isEditing ? (
					<form
						className={styles.row}
						onSubmit={async (e) => {
							e.preventDefault();
							await mutateAsync(editingState.inputValue);
							setEditingState({ isEditing: false });
						}}
					>
						<div className={styles.left}>
							<Input
								originalProps={{
									type: "text",
									value: editingState.inputValue,
									onChange: (e) =>
										setEditingState({
											inputValue: e.target.value,
											isEditing: true,
										}),
								}}
							/>
						</div>
						<div className={styles.right}>
							<div className={styles.buttons}>
								<Button
									color="none"
									size="medium"
									onClick={() => {
										setEditingState({ isEditing: false });
									}}
								>
									戻る
								</Button>
								<Button
									type="submit"
									color="primary"
									size="medium"
									data-loading={isLoading}
									disabled={isLoading}
								>
									保存
								</Button>
							</div>
						</div>
					</form>
				) : (
					<div className={styles.row}>
						<div className={styles.left}>
							<p>{name || "未設定"}</p>
						</div>
						<div className={styles.right}>
							<Button
								color="none"
								size="medium"
								onClick={() => {
									setEditingState({
										inputValue: name ?? "",
										isEditing: true,
									});
								}}
							>
								変更
							</Button>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

const DeleteAccount: React.FC<Pick<Props, "deleteUser">> = ({ deleteUser }) => {
	const { mutateAsync, isLoading, isSuccess } = useMutation(deleteUser);
	const { confirm, view } = useConfirmModal();
	const toast = useToast();

	return (
		<>
			{view}
			<section>
				<h2>退会</h2>
				<div className={styles.row}>
					<div className={styles.left}>
						{isLoading ? (
							<p className={styles.small}>退会処理中...</p>
						) : isSuccess ? (
							<p className={styles.small}>退会しました。</p>
						) : (
							<p className={styles.small}>
								退会すると、あなたが作成したストーリーが全て削除されます。
							</p>
						)}
					</div>
					{!isLoading && !isSuccess && (
						<div className={styles.right}>
							<Button
								color="danger"
								size="medium"
								onClick={async () => {
									if (
										await confirm(
											"本当に退会しますか？退会すると、あなたが作成したストーリーが全て削除されます。",
										)
									) {
										await mutateAsync();
										toast("退会しました。");
										signOut({
											callbackUrl: "/",
										});
									}
								}}
							>
								退会
							</Button>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export const Settings: React.FC<Props> = ({
	name,
	email,
	changeName,
	deleteUser,
}) => {
	return (
		<div className={styles.container}>
			<Heading level={1}>設定</Heading>
			<LoginInfo email={email} />
			<Name name={name} changeName={changeName} />
			<DeleteAccount deleteUser={deleteUser} />
		</div>
	);
};
