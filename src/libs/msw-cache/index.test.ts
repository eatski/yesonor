import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { initMswCacheServer } from ".";
import { anthropic } from "../claude";

describe("initCacheMswServer", () => {
	const server = initMswCacheServer();
	beforeAll(() => {
		server.listen();
	});
	afterAll(() => {
		server.close();
	});
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
