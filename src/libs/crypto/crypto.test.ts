import { describe, expect, test } from "vitest";
import { decrypt, encrypt } from "./crypto";

describe("crypto", () => {
	test("もとに戻る", () => {
		const password = "password";
		const text = "hello world";
		const encrypted = encrypt(text, password);
		expect(encrypted).not.toBe(text);
		const decrypted = decrypt(encrypted, password);
		expect(decrypted).toBe(text);
	});
	test("適当な文字列は複合できない", () => {
		const password = "password";
		expect(() => decrypt("hello world", password)).toThrowError();
	});
});
