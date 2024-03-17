import { describe, expect, test } from "vitest";
import { createMessage } from "../claude";
import { applyTestHooks } from "./vitest";
import { openai } from "../openai";

describe("initCacheMswServer", () => {
	applyTestHooks();
	test("fetch", async () => {
		const result = await fetch(
			"http://worldtimeapi.org/api/timezone/Africa/Lagos",
		);
		const json = await result.json();
		expect(json).toMatchSnapshot();
	});
	test("openai", async () => {
		const result = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are a helpful assistant.",
				},
				{
					role: "user",
					content: "What is your name?",
				},
			],
			max_tokens: 5,
		});
		expect(result.data.choices).toMatchSnapshot();
	});
	test("embeddings", async () => {
		const result = await openai.createEmbedding({
			model: "text-embedding-ada-002",
			input: [
				"Once upon a time",
				"There was a princess",
				"She lived in a castle",
			],
		});
		expect(result.data.data.length).toMatchSnapshot();
	});
	test("anthropic", async () => {
		const result = await createMessage({
			model: "claude-3-opus-20240229",
			messages: [
				{
					role: "user",
					content: "Hello, World",
				},
			],
			max_tokens: 5,
			stream: false,
		});
		expect(result.content).toMatchSnapshot();
	});
});
