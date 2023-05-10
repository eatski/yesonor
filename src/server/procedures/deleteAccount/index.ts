import { procedure } from "@/server/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { storyInit } from "@/server/services/story/schema";

export type Input = z.infer<typeof storyInit>;

export const deleteAccount = procedure.mutation(async ({ ctx }) => {
  const prisma = new PrismaClient();
  const result = await prisma.story.deleteMany({
    where: {
      authorEmail: ctx.user.email
    },
  });
  return true;
})