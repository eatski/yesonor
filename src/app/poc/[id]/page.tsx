const now = new Date();
console.log(now.toISOString());

export default function PoC() {
	return (
		<div>
			<h1>PoC</h1>
			<p>{now.toISOString()}</p>
		</div>
	);
}
