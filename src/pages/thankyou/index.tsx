import type { GetServerSideProps } from "next";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	// url query params からcodeを取得しcookieにセット
	const code = new URL(
		req.url as string,
		`http://${req.headers.host}`,
	).searchParams.get("code");

	if (!code) {
		return {
			notFound: true,
		};
	}
	// cookieにセット 保存期間は1年
	res.setHeader(
		"Set-Cookie",
		`thankyou=${code}; path=/; max-age=31536000; SameSite=None; Secure`,
	);

	return {
		props: {},
	};
};

export default function Thankyou() {
	return (
		<div
			style={{
				textAlign: "center",
			}}
		>
			<h1>ご支援ありがとうございます！</h1>
			<p>
				現在のブラウザを引き続きお使いいただければ一部の機能を優先してお楽しみいただけます。
			</p>
			<Link href="/">トップページへ戻る</Link>
		</div>
	);
}
