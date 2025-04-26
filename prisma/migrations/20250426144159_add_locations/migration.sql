-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "requiredLevel" INTEGER NOT NULL DEFAULT 1,
    "requiredShipLevel" INTEGER,
    "rewardExp" INTEGER NOT NULL DEFAULT 100,
    "rewardGold" INTEGER NOT NULL DEFAULT 50,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_name_key" ON "locations"("name");
