import { cookies } from "next/headers";

const now = new Date();
console.log(now.toISOString());

export default function PoC() {
	cookies().get("key");
	return (
		<div>
			<h1>PoC</h1>
			<p>{now.toISOString()}</p>
		</div>
	);
}
