import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const publishFirst = procedure.input(z.object({
  id: z.number(),
})).mutation(async ({ input, ctx }) => {
  const prisma = new PrismaClient();
  const { id } = input;
  await prisma.$transaction(async () => {
    return Promise.all([
      prisma.story.findFirst({
        where: {
          id: input.id,
          authorEmail: ctx.user.email,
          published: false,
          publishedAt: null
        }
      }).then(story => {
        if(story === null) throw new TRPCError({
          code: "NOT_FOUND",
        })
      }),
      prisma.story.update({
        where: {
          id: id
        },
        data : {
            published: true,
            publishedAt: new Date()
        }
      })
    ])
  })
  return true;
})