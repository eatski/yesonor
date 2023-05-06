-- CreateEnum
CREATE TYPE "Answer" AS ENUM ('True', 'False', 'Unknown', 'Invalid');

-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "authorEmail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "quiz" TEXT NOT NULL,
    "truth" TEXT NOT NULL,
    "simpleTruth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionExample" (
    "id" SERIAL NOT NULL,
    "storyId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" "Answer" NOT NULL,
    "supplement" TEXT NOT NULL,

    CONSTRAINT "QuestionExample_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_story" ON "QuestionExample"("storyId");

-- AddForeignKey
ALTER TABLE "QuestionExample" ADD CONSTRAINT "QuestionExample_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
