import { describe, expect, test } from "vitest";
import { anthropic } from "@/libs/claude";

describe.skip("claude", () => {
	test("動作確認", async () => {
		await expect(
			anthropic.messages.create({
				model: "claude-instant-1.2",
				max_tokens: 1,
				messages: [
					{
						role: "user",
						content: "Hello",
					},
				],
			}),
		).resolves.toBeDefined();
	});
});
