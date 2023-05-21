import { z } from "zod";

const answer = z.enum(["True", "False", "Unknown", "Invalid"]);

const questionExample = z.object({
  question: z.string().min(1),
  answer,
  supplement: z.string().min(1),
});

export const storyInit = z.object({
  title: z.string().min(1),
  quiz: z.string().min(1),
  truth: z.string().min(1),
  simpleTruth: z.string().min(1),
  questionExamples: z.array(questionExample).min(1),
});


export type StoryInit = z.infer<typeof storyInit>;