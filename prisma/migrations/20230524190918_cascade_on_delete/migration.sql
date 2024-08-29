-- DropForeignKey
ALTER TABLE `inventories` DROP FOREIGN KEY `inventories_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `inventory_items` DROP FOREIGN KEY `inventory_items_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `inventory_items` DROP FOREIGN KEY `inventory_items_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `refresh_tokens_userId_fkey`;

-- DropForeignKey
ALTER TABLE `users_resources` DROP FOREIGN KEY `users_resources_userId_fkey`;

-- AddForeignKey
ALTER TABLE `users_resources` ADD CONSTRAINT `users_resources_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_items` ADD CONSTRAINT `inventory_items_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_items` ADD CONSTRAINT `inventory_items_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `items`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
