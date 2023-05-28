import { z } from "zod";

const NON_EMPTY_MESSAGE = "この項目は必須です";

const answer = z.enum(["True", "False", "Unknown", "Invalid"]);

const questionExample = z.object({
	question: z.string().nonempty(NON_EMPTY_MESSAGE),
	answer,
	supplement: z.string().nonempty(NON_EMPTY_MESSAGE),
	customMessage: z.string().optional(),
});

export type QuestionExample = z.infer<typeof questionExample>;

export const storyInit = z.object({
	title: z.string().nonempty(NON_EMPTY_MESSAGE),
	quiz: z.string().nonempty(NON_EMPTY_MESSAGE),
	truth: z.string().nonempty(NON_EMPTY_MESSAGE),
	simpleTruth: z.string().nonempty(NON_EMPTY_MESSAGE),
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

export type StoryInit = z.infer<typeof storyInit>;

