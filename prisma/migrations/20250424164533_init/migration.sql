-- CreateEnum
CREATE TYPE "InventoryType" AS ENUM ('Player', 'Guild');

-- CreateTable
CREATE TABLE "users_resources" (
    "userId" INTEGER NOT NULL,
    "real" INTEGER NOT NULL DEFAULT 0,
    "doubloon" INTEGER NOT NULL DEFAULT 0,
    "wood" INTEGER NOT NULL DEFAULT 0,
    "sugar" INTEGER NOT NULL DEFAULT 0,
    "rum" INTEGER NOT NULL DEFAULT 0,
    "clotch" INTEGER NOT NULL DEFAULT 0,
    "iron" INTEGER NOT NULL DEFAULT 0,
    "crystal" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_resources_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "item_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "sell_price" INTEGER NOT NULL DEFAULT 0,
    "max_stack_size" INTEGER NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" SERIAL NOT NULL,
    "type" "InventoryType" NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "size" INTEGER NOT NULL DEFAULT 24,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "slot" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "itemId" TEXT,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("slot","inventoryId")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "avatar_hash" TEXT,
    "lvl" INTEGER NOT NULL DEFAULT 1,
    "hp" INTEGER NOT NULL DEFAULT 300,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "mana" INTEGER NOT NULL DEFAULT 0,
    "userSkillId" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type_id" TEXT NOT NULL,
    "power" INTEGER NOT NULL,
    "userSkillId" INTEGER,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skill" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "user_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mob" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "health" BIGINT NOT NULL,
    "mana" BIGINT NOT NULL DEFAULT 0,
    "image" TEXT,

    CONSTRAINT "mob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mob_skill" (
    "id" SERIAL NOT NULL,
    "mobId" INTEGER,
    "skillId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "mob_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "battleareaId" INTEGER,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_bom" (
    "id" SERIAL NOT NULL,
    "MobId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "room_bom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mob_enity" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "health" BIGINT NOT NULL,
    "mana" BIGINT NOT NULL,
    "mobId" INTEGER NOT NULL,
    "battleId" INTEGER NOT NULL,

    CONSTRAINT "mob_enity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_log" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "battleId" INTEGER NOT NULL,
    "mobEntityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "skillId" INTEGER,
    "actionText" TEXT NOT NULL,

    CONSTRAINT "battle_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_area_settings" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "level" INTEGER,
    "isAcitve" INTEGER,

    CONSTRAINT "battle_area_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle" (
    "id" SERIAL NOT NULL,
    "battleareaId" INTEGER,
    "isActive" BOOLEAN,
    "userId" INTEGER,

    CONSTRAINT "battle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_types_name_key" ON "item_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_ownerId_key" ON "inventories"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_userSkillId_key" ON "users"("userSkillId");

-- CreateIndex
CREATE UNIQUE INDEX "skill_name_key" ON "skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skill_userSkillId_key" ON "skill"("userSkillId");

-- CreateIndex
CREATE UNIQUE INDEX "mob_skill_mobId_key" ON "mob_skill"("mobId");

-- CreateIndex
CREATE UNIQUE INDEX "mob_skill_skillId_key" ON "mob_skill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "room_bom_MobId_key" ON "room_bom"("MobId");

-- CreateIndex
CREATE UNIQUE INDEX "room_bom_roomId_key" ON "room_bom"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "battle_log_mobEntityId_key" ON "battle_log"("mobEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "battle_log_userId_key" ON "battle_log"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "battle_log_skillId_key" ON "battle_log"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "battle_userId_key" ON "battle"("userId");

-- AddForeignKey
ALTER TABLE "users_resources" ADD CONSTRAINT "users_resources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "item_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_userSkillId_fkey" FOREIGN KEY ("userSkillId") REFERENCES "user_skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_userSkillId_fkey" FOREIGN KEY ("userSkillId") REFERENCES "user_skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mob_skill" ADD CONSTRAINT "mob_skill_mobId_fkey" FOREIGN KEY ("mobId") REFERENCES "mob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mob_skill" ADD CONSTRAINT "mob_skill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_battleareaId_fkey" FOREIGN KEY ("battleareaId") REFERENCES "battle_area_settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_bom" ADD CONSTRAINT "room_bom_MobId_fkey" FOREIGN KEY ("MobId") REFERENCES "mob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_bom" ADD CONSTRAINT "room_bom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mob_enity" ADD CONSTRAINT "mob_enity_mobId_fkey" FOREIGN KEY ("mobId") REFERENCES "mob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mob_enity" ADD CONSTRAINT "mob_enity_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "battle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_log" ADD CONSTRAINT "battle_log_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "battle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_log" ADD CONSTRAINT "battle_log_mobEntityId_fkey" FOREIGN KEY ("mobEntityId") REFERENCES "mob_enity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_log" ADD CONSTRAINT "battle_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_log" ADD CONSTRAINT "battle_log_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle" ADD CONSTRAINT "battle_battleareaId_fkey" FOREIGN KEY ("battleareaId") REFERENCES "battle_area_settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle" ADD CONSTRAINT "battle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
