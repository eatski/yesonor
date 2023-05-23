import { parseHeadToken } from "./parse";
import { describe, test, expect } from "vitest";

describe("parseHeadToken", () => {
	test("should return the string before the colon", () => {
		const input1 = "HOGE: fuga";
		const input2 = "PIYO: pico";

		expect(parseHeadToken(input1)).toBe("HOGE");
		expect(parseHeadToken(input2)).toBe("PIYO");
	});

	test("should return null if there is no colon in the input", () => {
		const input = "HOGE_fuga";

		expect(() => parseHeadToken(input)).throw();
	});

	test("should return null if the colon is at the beginning of the input", () => {
		const input = ": fuga";

		expect(() => parseHeadToken(input)).throw();
	});
});
