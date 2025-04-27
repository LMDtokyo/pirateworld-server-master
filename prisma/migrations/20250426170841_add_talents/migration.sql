-- AlterTable
ALTER TABLE "users" ADD COLUMN     "skillPoints" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "talents" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "bonusAttack" INTEGER NOT NULL DEFAULT 0,
    "bonusDefense" INTEGER NOT NULL DEFAULT 0,
    "bonusSpeed" INTEGER NOT NULL DEFAULT 0,
    "bonusLuck" INTEGER NOT NULL DEFAULT 0,
    "bonusMana" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "talents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_talents" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "talentId" INTEGER NOT NULL,

    CONSTRAINT "users_talents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "talents_name_key" ON "talents"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_talents_userId_talentId_key" ON "users_talents"("userId", "talentId");

-- AddForeignKey
ALTER TABLE "users_talents" ADD CONSTRAINT "users_talents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_talents" ADD CONSTRAINT "users_talents_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "talents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
