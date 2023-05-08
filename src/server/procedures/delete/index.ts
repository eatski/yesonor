import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { storyInit } from "../schema";
import { TRPCError } from "@trpc/server";

export type Input = z.infer<typeof storyInit>;

export const delete_ = procedure.input(z.object({
  id: z.number(),
})).mutation(async ({ input, ctx }) => {
  const prisma = new PrismaClient();
  const result = await prisma.story.deleteMany({
    where: {
      id: input.id,
      authorEmail: ctx.user.email
    },
  });
  if(result.count === 0){
    throw new TRPCError({
      code: "NOT_FOUND",
    })
  }
  return true;
})