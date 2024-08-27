import { describe, expect, test } from "vitest";
import { createMessage } from "../claude";
import { createOpenAICompletion, createOpenAIEmbedding } from "../openai";
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
		const { choices } = await createOpenAICompletion({
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
		const { data } = await createOpenAIEmbedding({
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
		const TOOL_USE_ID = "TOOL_USE_ID";
		const result = await createMessage({
			model: "claude-3-5-sonnet-20240620",
			system: "与えられた情報をもとにageとnameを抽出しregisterしてください",
			messages: [
				{
					role: "user",
					content: "私は山田花子、30歳よ。私の情報をDBに登録してね",
				},
				{
					role: "assistant",
					content: [
						{
							id: TOOL_USE_ID,
							type: "tool_use",
							name: "register",
							input: {
								name: "山田花子",
								age: 30,
							},
						},
					],
				},
				{
					role: "user",
					content: [
						{
							type: "tool_result",
							tool_use_id: TOOL_USE_ID,
						},
					],
				},
				{
					role: "assistant",
					content: "山田花子さんの情報を登録しました",
				},

				{
					role: "user",
					content: [
						{
							type: "text",
							text: "僕は春日、42歳です〜",
						},
					],
				},
			],
			tools: [
				{
					name: "register",
					input_schema: {
						type: "object",
						properties: {
							age: {
								type: "integer",
								minimum: 0,
							},
							name: {
								type: "string",
							},
						},
						required: ["age", "name"],
					},
				},
			],
			max_tokens: 1024,
			stream: false,
		});
		expect(result.content).toMatchSnapshot();
	});
});
