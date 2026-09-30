-- AlterTable: link DB step rows to roadmap JSON step ids (content/roadmaps)
ALTER TABLE "Step" ADD COLUMN "contentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Step_contentId_key" ON "Step"("contentId");
