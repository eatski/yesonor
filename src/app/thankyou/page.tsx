import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { SetCode } from "./_components/SetThankyouCode";

export default async function Thankyou({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const code = searchParams.code;

	if (typeof code !== "string") {
		notFound();
	}

	if (code !== process.env.THANKYOU_CODE) {
		notFound();
	}

	const setCode = async () => {
		"use server";
		cookies().set("thankyou", code, {
			httpOnly: true,
			secure: true,
			//3年
			maxAge: 60 * 60 * 24 * 365 * 3,
			sameSite: "none",
		});
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<h1>優先アクセス権の付与</h1>
			<p>
				ご支援ありがとうございます！サービスへの優先的なアクセス権を付与します。
			</p>
			<SetCode set={setCode} />
		</div>
	);
}
