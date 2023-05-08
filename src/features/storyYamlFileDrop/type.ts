import { z } from "zod";

const answer = z.enum(["はい", "いいえ", "わからない"]).transform(text => {
  switch (text) {
    case "はい":
      return "True";
    case "いいえ":
      return "False";
    case "わからない":
      return "Unknown";
  }
});

const questionExample = z.object({
  question: z.string(),
  answer,
  supplement: z.string(),
});

export const storyInitYaml = z.object({
  title: z.string(),
  quiz: z.string(),
  truth: z.string(),
  simpleTruth: z.string(),
  questionExamples: z.array(questionExample),
});