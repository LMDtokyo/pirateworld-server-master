-- AlterTable
ALTER TABLE "talents" ADD COLUMN     "specialSkill" TEXT;

-- CreateTable
CREATE TABLE "passive_skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "bonusResourceDrop" INTEGER NOT NULL DEFAULT 0,
    "bonusHarpoonCd" INTEGER NOT NULL DEFAULT 0,
    "bonusMortarCd" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "passive_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_passive_skills" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "passiveId" INTEGER NOT NULL,

    CONSTRAINT "users_passive_skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "passive_skills_name_key" ON "passive_skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_passive_skills_userId_passiveId_key" ON "users_passive_skills"("userId", "passiveId");

-- AddForeignKey
ALTER TABLE "users_passive_skills" ADD CONSTRAINT "users_passive_skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_passive_skills" ADD CONSTRAINT "users_passive_skills_passiveId_fkey" FOREIGN KEY ("passiveId") REFERENCES "passive_skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
