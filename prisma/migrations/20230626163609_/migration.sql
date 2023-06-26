-- CreateEnum
CREATE TYPE "SolutionResult" AS ENUM ('Correct', 'Incorrect');

-- CreateTable
CREATE TABLE "SolutionLog" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "result" "SolutionResult" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SolutionLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SolutionLog" ADD CONSTRAINT "SolutionLog_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
