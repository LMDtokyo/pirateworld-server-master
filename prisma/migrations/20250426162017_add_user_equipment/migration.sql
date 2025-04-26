-- AlterTable
ALTER TABLE "items" ADD COLUMN     "bonusAttack" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bonusDefense" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bonusLuck" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bonusManeuverability" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bonusRepairSpeed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bonusSpeed" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "users_equipment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "users_equipment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users_equipment" ADD CONSTRAINT "users_equipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_equipment" ADD CONSTRAINT "users_equipment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("name") ON DELETE CASCADE ON UPDATE CASCADE;
