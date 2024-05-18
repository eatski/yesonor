import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { openai } from "@/libs/openai";
import type { QuestionExample } from "@/server/model/story";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { answer as answerSchema } from "../../../model/story";
import { OPENAI_ERROR_MESSAGE } from "../../../procedures/question/contract";
const systemPromptPromise = readFile(
	resolve(process.cwd(), "prompts", "question.md"),
);

const functionArgsSchema = z.object({
	"0_problemSolvingProcess": z.string(),
	"1_answer": answerSchema,
});

export const questionToAI = async (
	story: {
		quiz: string;
		truth: string;
		questionExamples: QuestionExample[];
	},
	question: string,
) => {
	const response = await openai.chat.completions
		.create({
			model: "gpt-4o-2024-05-13",
			function_call: {
				name: "asnwer",
			},
			user: "testes",
			functions: [
				{
					name: "asnwer",
					description: "Answer the question",
					parameters: zodToJsonSchema(functionArgsSchema),
				},
			],
			messages: [
				{
					role: "system",
					content: (await systemPromptPromise).toString(),
				},
				{
					role: "assistant",
					content: story.quiz,
				},
				{
					role: "user",
					content: "真相を教えてください。",
				},
				{
					role: "assistant",
					content: story.truth,
				},
				{
					role: "user",
					content: "答えがわからないのでいくつか質問をしますね。",
				},
				...story.questionExamples.flatMap(
					({ question, answer, supplement }) => {
						return [
							{
								role: "user",
								content: question,
							},
							{
								role: "assistant",
								content: supplement ? `${answer}:${supplement}` : answer,
							},
						] as const;
					},
				),
				{
					role: "user",
					content: question,
				},
			],
			temperature: 0,
		})
		.catch((e) => {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: OPENAI_ERROR_MESSAGE,
				cause: e,
			});
		});
	const args = response.choices[0]?.message?.function_call?.arguments;
	if (!args) {
		throw new Error("No args");
	}
	return functionArgsSchema.parse(JSON.parse(args))["1_answer"];
};
