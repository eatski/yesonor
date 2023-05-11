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
    "questionExamples" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);
