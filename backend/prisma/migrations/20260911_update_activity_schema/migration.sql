-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('MULTIPLE_CHOICE', 'WORD_SEARCH');

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN "type" "ActivityType" NOT NULL DEFAULT 'MULTIPLE_CHOICE',
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "WordSearch" (
    "id" TEXT NOT NULL,
    "grid" TEXT[],
    "words" TEXT[],
    "orientation" TEXT[],
    "positions" TEXT[],
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordSearch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WordSearch" ADD CONSTRAINT "WordSearch_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "WordSearch_activityId_key" ON "WordSearch"("activityId");

-- AlterTable Submission
ALTER TABLE "Submission" ADD COLUMN "foundWords" TEXT[] DEFAULT ARRAY[]::TEXT[];
