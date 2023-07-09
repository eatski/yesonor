import { H1 } from "@/designSystem/components/heading";
import React, { useState } from "react";
import components from "@/designSystem/components.module.scss";
import styles from "./styles.module.scss";
import { trpc } from "@/libs/trpc";
import { signOut } from "next-auth/react";

export type Props = {
	name: string | null;
	email: string;
};

const LoginInfo = ({ email }: Props) => {
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

const Name: React.FC<Props> = ({ name }) => {
	type EditingState =
		| { inputValue: string; isEditing: true }
		| { isEditing: false };

	const [editingState, setEditingState] = useState<EditingState>({
		isEditing: false,
	});
	const {
		mutateAsync,
		isLoading,
		data: editedName,
	} = trpc.user.putName.useMutation();

	const currentName = editedName ?? name;

	return (
		<section>
			<h2>表示名</h2>
			<div>
				{editingState.isEditing ? (
					<form
						className={styles.row}
						onSubmit={async (e) => {
							e.preventDefault();
							await mutateAsync({ name: editingState.inputValue });
							setEditingState({ isEditing: false });
						}}
					>
						<div className={styles.left}>
							<input
								className={components.input}
								type="text"
								value={editingState.inputValue}
								onChange={(e) =>
									setEditingState({
										inputValue: e.target.value,
										isEditing: true,
									})
								}
							/>
						</div>
						<div className={styles.right}>
							<div className={styles.buttons}>
								<button
									type="button"
									className={components.buttonLink}
									onClick={() => {
										setEditingState({ isEditing: false });
									}}
								>
									戻る
								</button>
								<button
									type="submit"
									className={components.button}
									data-loading={isLoading}
									disabled={isLoading}
								>
									保存
								</button>
							</div>
						</div>
					</form>
				) : (
					<div className={styles.row}>
						<div className={styles.left}>
							<p>{currentName || "未設定"}</p>
						</div>

						<div className={styles.right}>
							<button
								className={components.buttonLink}
								onClick={() => {
									setEditingState({
										inputValue: currentName ?? "",
										isEditing: true,
									});
								}}
							>
								変更
							</button>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

const DeleteAccount: React.FC = () => {
	const { mutateAsync, isLoading, isSuccess } =
		trpc.deleteAccount.useMutation();

	return (
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
						<button
							className={components.buttonDanger}
							onClick={async () => {
								if (
									confirm(
										"本当に退会しますか？退会すると、あなたが作成したストーリーが全て削除されます。",
									)
								) {
									await mutateAsync();
									alert("退会しました。");
									signOut({
										callbackUrl: "/",
									});
								}
							}}
						>
							退会
						</button>
					</div>
				)}
			</div>
		</section>
	);
};

export const Settings: React.FC<Props> = ({ name, email }) => {
	return (
		<main className={styles.container}>
			<H1>設定</H1>
			<LoginInfo name={name} email={email} />
			<Name name={name} email={email} />
			<DeleteAccount />
		</main>
	);
};
