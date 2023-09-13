import { QuestionExample } from "@/server/model/story";
import { TRPCError } from "@trpc/server";
import { OpenAIApi } from "openai";
import { OPENAI_ERROR_MESSAGE } from "./contract";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { answer as answerSchema } from "../../model/story";
import { z } from "zod";
const systemPromptPromise = readFile(
	resolve(process.cwd(), "prompts", "question.md"),
);

const functionArgsSchema = z.object({
	answer: answerSchema,
});

export const questionToAI = async (
	openai: OpenAIApi,
	story: {
		quiz: string;
		truth: string;
		questionExamples: QuestionExample[];
	},
	question: string,
) => {
	const response = await openai
		.createChatCompletion({
			model: "gpt-4-0613",
			function_call: {
				name: "asnwer",
			},
			functions: [
				{
					name: "asnwer",
					description: "Answer the question",
					parameters: {
						type: "object",
						properties: {
							answer: {
								type: "string",
								enum: ["True", "False", "Unknown"],
							},
						},
					},
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
					role: "assistant",
					content: story.truth,
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
	const args = response.data.choices[0]?.message?.function_call?.arguments;
	if (!args) {
		throw new Error("No args");
	}
	return functionArgsSchema.parse(JSON.parse(args)).answer;
};
