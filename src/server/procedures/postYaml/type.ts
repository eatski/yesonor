import { z } from "zod";

const answer = z.enum(["はい", "いいえ", "わからない", "Invalid"]);

const questionExample = z.object({
  question: z.string(),
  answer,
  supplement: z.string(),
});

export const storyInput = z.object({
  title: z.string(),
  quiz: z.string(),
  truth: z.string(),
  simpleTruth: z.string(),
  questionExamples: z.array(questionExample),
});