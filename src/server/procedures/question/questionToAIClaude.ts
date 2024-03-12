import { QuestionExample } from "@/server/model/story";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { answer as answerSchema } from "../../model/story";
import { anthropic } from "@/libs/claude";
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
	const response = await anthropic.messages.create({
		model: "claude-3-sonnet-20240229",
		max_tokens: 1,
		messages: [
			{
				role: "user",
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
				(example) =>
					[
						{
							role: "user",
							content: example.question,
						},
						{
							role: "assistant",
							content: example.answer,
						},
					] as const,
			),
			{
				role: "user",
				content: question,
			},
		],
	});
	const block = response.content[0];
	if (!block) {
		throw new Error("No args");
	}
	return answerSchema.parse(block.text);
};
