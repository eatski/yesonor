import { nextCache } from "@/server/serverComponent/nextCache";
import { cookies } from "next/headers";

const now = new Date();
console.log(now.toISOString());

export default async function PoC() {
	cookies().get("key");
	console.log("render", now.toISOString());
	const cachedNow = await nextCache(() => {
		const now = new Date();
		console.log("nextCache", now.toISOString());
		return now.toISOString();
	}, ["cachedNow2"])();
	return (
		<div>
			<h1>PoC</h1>
			<p>{now.toISOString()}</p>
			<p>{cachedNow}</p>
		</div>
	);
}
