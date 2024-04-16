import { QuestionExample } from "@/server/model/story";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { answer as answerSchema } from "../../../model/story";
import { createMessage } from "@/libs/claude";
import { z } from "zod";
import { MessageParam } from "@anthropic-ai/sdk/resources";

const createMessages = (
	story: {
		quiz: string;
		truth: string;
		questionExamples: QuestionExample[];
	},
	question: string,
): MessageParam[] => {
	return [
		{
			role: "user",
			content: "Let's play a quiz game.",
		},
		{
			role: "assistant",
			content: story.quiz,
		},
		{
			role: "user",
			content: "What is the truth?",
		},
		{
			role: "assistant",
			content: story.truth,
		},
		...story.questionExamples.flatMap(({ question, answer }) => {
			return [
				{
					role: "user",
					content: question,
				},
				{
					role: "assistant",
					content: answer,
				},
			] as const;
		}),
		{
			role: "user",
			content: question,
		},
	];
};

export const questionToAIWithHaiku = async (
	story: {
		quiz: string;
		truth: string;
		questionExamples: QuestionExample[];
	},
	question: string,
) => {
	const haikuAnswer = z.enum(["True", "False", "Unknown", "Pass"]);
	const systemPromptPromise = readFile(
		resolve(process.cwd(), "prompts", "question_claude_haiku.md"),
	);

	const response = await createMessage({
		model: "claude-3-haiku-20240307",
		max_tokens: 1,
		temperature: 0,
		messages: createMessages(story, question),
		system: (await systemPromptPromise).toString(),
	});
	const block = response.content[0];
	if (!block) {
		throw new Error("AI's response has no content");
	}
	const parsed = haikuAnswer.safeParse(block.text);
	const answer1st = parsed.success ? parsed.data : "Unknown";
	if (answer1st === "Pass") {
		return questionToAI(story, question);
	}
	return answer1st;
};

export const questionToAI = async (
	story: {
		quiz: string;
		truth: string;
		questionExamples: QuestionExample[];
	},
	question: string,
) => {
	const systemPromptPromise = readFile(
		resolve(process.cwd(), "prompts", "question_claude.md"),
	);
	const response = await createMessage({
		model: "claude-3-sonnet-20240229",
		max_tokens: 1,
		temperature: 0,
		messages: createMessages(story, question),
		system: (await systemPromptPromise).toString(),
	});
	const block = response.content[0];
	if (!block) {
		throw new Error("AI's response has no content");
	}
	const answer = answerSchema.safeParse(block.text);
	return answer.success ? answer.data : "Unknown";
};
