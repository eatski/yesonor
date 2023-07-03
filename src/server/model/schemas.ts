import { z } from "zod";

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

// export const story = z.object({
// 	id: z.string(),
// 	author: z.object({
// 		id: z.string(),
// 		name: z.string().nullable(),
// 	}),
// 	title: z.string(),
// 	quiz: z.string(),
// 	truth: z.string(),
// 	simpleTruth: z.string(),
// 	questionExamples: z.array(questionExample),
// 	publishedAt: z.date().nullable(),
// 	published: z.boolean(),
// 	createdAt: z.date(),
// });

export const storyInit = z.object({
	title: z
		.string()
		.nonempty(NON_EMPTY_MESSAGE)
		.max(30, "30文字以内で入力してください"),
	quiz: z
		.string()
		.nonempty(NON_EMPTY_MESSAGE)
		.max(200, "200文字以内で入力してください"),
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

export const questionLog = z.object({
	question: z.string(),
	answer,
	storyId: z.string(),
});

export const truthCoincidence = z.enum(["Covers", "Wrong", "Insufficient"]);
