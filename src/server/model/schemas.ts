import { z } from "zod";

export const answer = z.enum(["True", "False", "Unknown", "Invalid"]);

export const questionExample = z.object({
	question: z.string(),
	answer,
	supplement: z.string(),
});

export const story = z.object({
	title: z.string(),
	authorEmail: z.string().email(),
	quiz: z.string(),
	truth: z.string(),
	simpleTruth: z.string(),
	questionExamples: z.array(questionExample),
	createdAt: z.date(),
});

export const truthCoincidence = z.enum(["Covers", "Wrong", "Insufficient"]);
