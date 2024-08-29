/*
  Warnings:

  - You are about to drop the `inventory_slots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `inventory_slots` DROP FOREIGN KEY `inventory_slots_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `inventory_slots` DROP FOREIGN KEY `inventory_slots_itemId_fkey`;

-- DropTable
DROP TABLE `inventory_slots`;

-- CreateTable
CREATE TABLE `inventory_items` (
    `slot` INTEGER NOT NULL,
    `inventoryId` INTEGER NOT NULL,
    `itemId` VARCHAR(191) NULL,

    PRIMARY KEY (`slot`, `inventoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inventory_items` ADD CONSTRAINT `inventory_items_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_items` ADD CONSTRAINT `inventory_items_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `items`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
