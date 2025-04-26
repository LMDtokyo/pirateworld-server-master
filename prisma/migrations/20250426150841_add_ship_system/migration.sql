-- CreateTable
CREATE TABLE "ships" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Unnamed Ship',
    "level" INTEGER NOT NULL DEFAULT 1,
    "hp" INTEGER NOT NULL DEFAULT 1000,
    "mana" INTEGER NOT NULL DEFAULT 0,
    "attack" INTEGER NOT NULL DEFAULT 100,
    "speed" INTEGER NOT NULL DEFAULT 0,
    "defense" INTEGER NOT NULL DEFAULT 0,
    "maneuverability" INTEGER NOT NULL DEFAULT 0,
    "luck" INTEGER NOT NULL DEFAULT 0,
    "repairSpeed" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ship_equipment" (
    "id" SERIAL NOT NULL,
    "shipId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "bonusAttack" INTEGER NOT NULL DEFAULT 0,
    "bonusSpeed" INTEGER NOT NULL DEFAULT 0,
    "bonusDefense" INTEGER NOT NULL DEFAULT 0,
    "bonusDamage" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ship_equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ship_crew" (
    "id" SERIAL NOT NULL,
    "shipId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "bonusHp" INTEGER NOT NULL DEFAULT 0,
    "bonusAttack" INTEGER NOT NULL DEFAULT 0,
    "bonusSpeed" INTEGER NOT NULL DEFAULT 0,
    "bonusDefense" INTEGER NOT NULL DEFAULT 0,
    "bonusLuck" INTEGER NOT NULL DEFAULT 0,
    "bonusRepairSpeed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ship_crew_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ships_userId_key" ON "ships"("userId");

-- AddForeignKey
ALTER TABLE "ships" ADD CONSTRAINT "ships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ship_equipment" ADD CONSTRAINT "ship_equipment_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "ships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ship_crew" ADD CONSTRAINT "ship_crew_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "ships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
