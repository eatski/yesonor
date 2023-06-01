import { H2 } from "@/common/components/h2";
import { Layout } from "@/features/layout";
import { getUser, User } from "@/server/getServerSideProps/getUser";
import { GetServerSideProps } from "next";
import components from "@/styles/components.module.scss";
import { trpc } from "@/libs/trpc";
import {} from "next-auth";
import { signOut } from "next-auth/react";

type Props = {
	user: User;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const user = await getUser(ctx);
	if (!user) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			user,
		},
	};
};

export default function MyPage(props: Props) {
	const { mutateAsync, isLoading, data } = trpc.deleteAccount.useMutation();
	return (
		<Layout>
			<>
				<H2 label="マイページ" />
				<dl>
					<dt>メールアドレス</dt>
					<dd>{props.user.email}</dd>
				</dl>
				{isLoading ? (
					<p>退会処理中...</p>
				) : data ? (
					<p>退会しました</p>
				) : (
					<button
						onClick={async () => {
							if (
								confirm(
									"本当に退会しますか？あなたが作成したストーリーが全て削除されます。",
								)
							) {
								await mutateAsync();
								signOut({
									callbackUrl: "/",
								});
							}
						}}
						className={components.buttonDanger}
						disabled={isLoading}
					>
						退会
					</button>
				)}
			</>
		</Layout>
	);
}
