import { encrypt as en, decrypt as de } from "./crypto";

export const encrypt = (text: string): string => {
	if (process.env.CRYPTO_KEY === undefined)
		throw new Error("CRYPTO_KEY is not defined");

	const CRYPTO_KEY = process.env.CRYPTO_KEY;
	return en(text, CRYPTO_KEY);
};

export const decrypt = (text: string): string | false => {
	if (process.env.CRYPTO_KEY === undefined)
		throw new Error("CRYPTO_KEY is not defined");

	const CRYPTO_KEY = process.env.CRYPTO_KEY;
	try {
		return de(text, CRYPTO_KEY);
	} catch (error) {
		return false;
	}
};
