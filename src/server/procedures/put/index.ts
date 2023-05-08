import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { storyInit } from "../schema";
import { TRPCError } from "@trpc/server";

export type Input = z.infer<typeof storyInit>;

export const put = procedure.input(z.object({
  id: z.number(),
  story: storyInit
})).mutation(async ({ input, ctx }) => {

  const prisma = new PrismaClient();
  const { id, story } = input;
  const { questionExamples, ...storyData } = story;
  await prisma.$transaction(async () => {
    return Promise.all([
      prisma.story.findFirst({
        where: {
          id: input.id,
          authorEmail: ctx.user.email
        }
      }).then(story => {
        if(story === null) throw new TRPCError({
          code: "NOT_FOUND",
        })
      }),
      prisma.questionExample.deleteMany({
        where: {
          storyId: id
        }
      }),
      prisma.story.update({
        where: {
          id: id
        },
        data :{
          ...storyData,
          questionExamples: {
            create: questionExamples,
          },
        }
      })
    ])
  },{
    // HACK: 中が遅すぎるのでtimeoutを長めに設定
    timeout: 10000 
  })
  return true;
})