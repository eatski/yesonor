export const verifyRecaptcha = async (token: string): Promise<void> => {
	if (process.env.NEXT_PUBLIC_DISABLE_RECAPTCHA) {
		if (token === process.env.NEXT_PUBLIC_DISABLE_RECAPTCHA) {
			return;
		}
		throw new Error("Recaptcha failed(NEXT_PUBLIC_DISABLE_RECAPTCHA=true))");
	}
	const res = await fetch(
		`https://recaptcha.net/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
		{
			method: "POST",
		},
	);
	const json = await res.json();
	if (!json.success || json.score < 0.4) {
		throw new Error(`Recaptcha failed. score: ${json.score}.`);
	}
};
