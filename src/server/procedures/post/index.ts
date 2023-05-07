import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { storyInit } from "./type";

export type Input = z.infer<typeof storyInit>;

export const post = procedure.input(storyInit).mutation(async ({ input, ctx }) => {
  const prisma = new PrismaClient();
  const { questionExamples, ...storyData } = input;

  // create story and associated questionExamples
  const story = await prisma.story.create({
    data: {
      ...storyData,
      questionExamples: {
        create: questionExamples,
      },
      authorEmail: ctx.user.email,
    },
    include: {
      questionExamples: true,
    },
  });
  return story;
})