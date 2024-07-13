"use client";
import { Button } from "@/designSystem/components/button";
import { useRouter } from "next/navigation";

export const SetCode: React.FC<{ set: () => Promise<void> }> = ({ set }) => {
	const router = useRouter();
	return (
		<Button
			color="primary"
			size="medium"
			onClick={async () => {
				await set();
				router.push("/");
			}}
		>
			優先アクセス権を獲得
			<br />
			（トップページに遷移します）
		</Button>
	);
};
