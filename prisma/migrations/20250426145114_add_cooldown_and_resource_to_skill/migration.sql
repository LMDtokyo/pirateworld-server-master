-- AlterTable
ALTER TABLE "skill" ADD COLUMN     "cooldown" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "resource" TEXT,
ADD COLUMN     "resourceCost" INTEGER NOT NULL DEFAULT 0;
