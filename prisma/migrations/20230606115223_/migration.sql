/*
  Warnings:

  - You are about to drop the column `authorEmail` on the `Story` table. All the data in the column will be lost.
  - Made the column `authorId` on table `Story` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Story" DROP COLUMN "authorEmail",
ALTER COLUMN "authorId" SET NOT NULL;
