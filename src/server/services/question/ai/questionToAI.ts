import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createOpenAICompletion } from "../../../../libs/openai";
import type { QuestionExample } from "../../../../server/model/story";
import { answer as answerSchema } from "../../../model/story";
const systemPromptPromise = readFile(
	resolve(process.cwd(), "prompts", "question.md"),
);

export const questionToAI = async (
	story: {
		quiz: string;
		truth: string;
		questionExamples: QuestionExample[];
	},
	question: string,
) => {
	const response = await createOpenAICompletion({
		model: "gpt-4o-mini-2024-07-18",
		user: "testes",
		max_tokens: 1,
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
			...story.questionExamples.flatMap(({ question, answer, supplement }) => {
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
			}),
			{
				role: "user",
				content: question,
			},
		],
		temperature: 0,
	});
	const args = response.choices[0]?.message.content;
	if (!args) {
		throw new Error("No args");
	}
	return answerSchema.parse(args);
};
