import { z } from "zod";
import { Override, Public } from "./util";
import { Story as DbStory } from "@prisma/client";
import { User } from "./user";

const NON_EMPTY_MESSAGE = "この項目は必須です";

export const answer = z.enum(["True", "False", "Unknown", "Invalid"]);

export const questionExample = z.object({
	question: z
		.string()
		.nonempty(NON_EMPTY_MESSAGE)
		.max(100, "100文字以内で入力してください"),
	answer,
	supplement: z.string().max(100, "100文字以内で入力してください").optional(),
	customMessage: z
		.string()
		.max(100, "100文字以内で入力してください")
		.optional(),
});

export type Question = {
	question: string;
	answer: Answer;
};

export const storyInit = z.object({
	title: z
		.string()
		.nonempty(NON_EMPTY_MESSAGE)
		.max(30, "30文字以内で入力してください"),
	quiz: z
		.string()
		.nonempty(NON_EMPTY_MESSAGE)
		.max(140, "140文字以内で入力してください"),
	truth: z
		.string()
		.nonempty(NON_EMPTY_MESSAGE)
		.max(400, "400文字以内で入力してください"),
	simpleTruth: z
		.string()
		.nonempty(NON_EMPTY_MESSAGE)
		.max(100, "100文字以内で入力してください"),
	questionExamples: z
		.array(questionExample)
		.min(3, "3つ以上の質問を入力してください")
		.refine((data) => {
			const answers = data.map((question) => question.answer);
			return (
				answers.includes("True") &&
				answers.includes("False") &&
				answers.includes("Unknown")
			);
		}, "AIの精度を上げるため、回答がはい、いいえ、わからないをそれぞれ1つ以上入力してください"),
});

export const truthCoincidence = z.enum(["Covers", "Wrong"]);

export type Story = Public<
	Override<
		DbStory,
		{
			questionExamples: z.infer<typeof questionExample>[];
		}
	> & {
		author: User;
	},
	| "title"
	| "id"
	| "truth"
	| "simpleTruth"
	| "quiz"
	| "author"
	| "questionExamples"
	| "publishedAt"
	| "published"
>;

export type StoryWithQuestionLogs = Story & {
	questionLogs: Question[];
};

export type StoryHead = Omit<
	Story,
	"truth" | "simpleTruth" | "questionExamples"
>;
export type Answer = z.infer<typeof answer>;
export type TruthCoincidence = z.infer<typeof truthCoincidence>;
export type StoryInit = z.infer<typeof storyInit>;
export type QuestionExample = z.infer<typeof questionExample>;
export type QuestionExampleWithCustomMessage = QuestionExample & {
	customMessage: string;
};

export const filterWithCustomMessage = (
	examples: QuestionExample[],
): QuestionExampleWithCustomMessage[] => {
	const filterd: QuestionExampleWithCustomMessage[] = [];
	for (const example of examples) {
		if (example.customMessage) {
			filterd.push({
				...example,
				customMessage: example.customMessage,
			});
		}
	}
	return filterd;
};
