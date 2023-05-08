import { z } from "zod";

const answer = z.enum(["True", "False", "Unknown", "Invalid"]);

const questionExample = z.object({
  question: z.string(),
  answer,
  supplement: z.string(),
});

export const storyInit = z.object({
  title: z.string(),
  quiz: z.string(),
  truth: z.string(),
  simpleTruth: z.string(),
  questionExamples: z.array(questionExample),
});


export type StoryInit = z.infer<typeof storyInit>;