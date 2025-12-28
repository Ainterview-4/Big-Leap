-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "cvId" TEXT,
ADD COLUMN     "difficulty" TEXT;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE SET NULL ON UPDATE CASCADE;
