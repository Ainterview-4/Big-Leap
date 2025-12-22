-- AlterTable
ALTER TABLE "InterviewSession" ADD COLUMN     "currentQuestion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "feedback" TEXT;
