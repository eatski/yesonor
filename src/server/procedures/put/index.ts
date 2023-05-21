import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { storyInit } from "@/server/services/story/schema";
import { TRPCError } from "@trpc/server";

export type Input = z.infer<typeof storyInit>;

export const put = procedure.input(z.object({
  id: z.string(),
  story: storyInit
})).mutation(async ({ input, ctx }) => {

  const prisma = new PrismaClient();
  const { id, story } = input;
  const { questionExamples, ...storyData } = story;
  await prisma.story.updateMany({
    where: {
      id: id,
      authorEmail: (await ctx.getUser()).email
    },
    data :{
      ...storyData,
      questionExamples: JSON.stringify(questionExamples),
    }
  })
  ctx.doRevalidate(`/stories/${input.id}`).catch();
  return true;
})