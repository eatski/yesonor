import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { storyInit } from "./type";
import { setTimeout } from "timers/promises";

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

  const retryable = (count: number,error?: any): Promise<void> => {
    if(count){
      return setTimeout(3000).then(() => ctx.doRevalidate(`/stories/${story.id}`).catch((e) => {
        return retryable(count - 1,e)
      }))
    }
    return Promise.reject( new Error("revalidation failed",{
      cause: error
    }))
  }
  await retryable(10);
  return story;
})