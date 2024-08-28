import Link from "next/link";

export default function PoC() {
	return (
		<div>
			<h1>PoC</h1>
			<p>Proof of concept.</p>
			{[1, 2, 3].map((i) => (
				<Link prefetch key={i} href={`/poc/${i}`}>
					{i}
				</Link>
			))}
		</div>
	);
}
