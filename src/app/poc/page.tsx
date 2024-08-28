import { nextCache } from "@/server/serverComponent/nextCache";
import Link from "next/link";

export default async function PoC() {
	const from = new Date();
	const cachedNow = await nextCache(() => {
		const now = new Date();
		console.log("nextCache", now.toISOString());
		return now.toISOString();
	}, ["cachedNow"])();
	const to = new Date();
	return (
		<div>
			<h1>PoC</h1>
			<p>Proof of concept.</p>
			<p>{cachedNow}</p>
			<p>
				{from.toISOString()} ~ {to.toISOString()}
			</p>
			{[1, 2, 3].map((i) => (
				<Link prefetch key={i} href={`/poc/${i}`}>
					{i}
				</Link>
			))}
		</div>
	);
}
