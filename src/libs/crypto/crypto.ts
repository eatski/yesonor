import crypto from "crypto";

export function encrypt(text: string, password: string): string {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(
		"aes-256-cbc",
		crypto.createHash("sha256").update(password).digest(),
		iv,
	);
	const encrypted = Buffer.concat([
		cipher.update(text, "utf8"),
		cipher.final(),
	]);
	return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(text: string, password: string): string {
	const parts = text.split(":");
	const iv = Buffer.from(parts.shift()!, "hex");
	const encryptedText = Buffer.from(parts.join(":"), "hex");
	const decipher = crypto.createDecipheriv(
		"aes-256-cbc",
		crypto.createHash("sha256").update(password).digest(),
		iv,
	);
	const decrypted = Buffer.concat([
		decipher.update(encryptedText),
		decipher.final(),
	]);
	return decrypted.toString("utf8");
}
