import { describe, expect, test } from "vitest";
import { anthropic } from "../claude";
import { applyTestHooks } from "./vitest";

describe("initCacheMswServer", () => {
	applyTestHooks();
	test("anthropic", async () => {
		const result = await anthropic.messages.create({
			model: "claude-3-opus-20240229",
			messages: [
				{
					role: "user",
					content: "こんにちわ",
				},
			],
			max_tokens: 1000,
			stream: false,
		});
		expect(result.content).toMatchSnapshot();
	});
});
