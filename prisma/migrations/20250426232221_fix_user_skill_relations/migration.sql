/*
  Warnings:

  - You are about to drop the column `userSkillId` on the `skill` table. All the data in the column will be lost.
  - You are about to drop the column `userSkillId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "skill" DROP CONSTRAINT "skill_userSkillId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_userSkillId_fkey";

-- DropIndex
DROP INDEX "skill_userSkillId_key";

-- DropIndex
DROP INDEX "users_userSkillId_key";

-- AlterTable
ALTER TABLE "skill" DROP COLUMN "userSkillId";

-- AlterTable
ALTER TABLE "user_skill" ALTER COLUMN "level" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "userSkillId";

-- AddForeignKey
ALTER TABLE "user_skill" ADD CONSTRAINT "user_skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skill" ADD CONSTRAINT "user_skill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
