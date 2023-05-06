import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const answer = z.enum(["TRUE", "FALSE", "UNKNOWN", "INVALID"]);

const questionExample = z.object({
  question: z.string(),
  answer,
  supplement: z.string(),
});

const input = z.object({
  title: z.string(),
  description: z.string(),
  quiz: z.string(),
  truth: z.string(),
  simpleTruth: z.string(),
  questionExamples: z.array(questionExample),
});

export type Input = z.infer<typeof input>;

export const post = procedure.input(input).mutation(async ({input} ) => {
    const prisma = new PrismaClient();
    const { questionExamples, ...storyData } = input;

  // create story and associated questionExamples
  const story = await prisma.story.create({
    data: {
      ...storyData,
      questionExamples: {
        create: questionExamples,
      },
    },
    include: {
      questionExamples: true,
    },
  });

  return story;
})