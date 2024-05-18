import { describe, expect, test } from "vitest";
import { createMessage } from "../claude";
import { openai } from "../openai";
import { applyTestHooks } from "./vitest";

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
		const { choices } = await openai.chat.completions.create({
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
		expect(choices).toMatchSnapshot();
	});
	test("embeddings", async () => {
		const { data } = await openai.embeddings.create({
			model: "text-embedding-ada-002",
			input: [
				"Once upon a time",
				"There was a princess",
				"She lived in a castle",
			],
		});
		expect(data.length).toMatchSnapshot();
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
