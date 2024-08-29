-- CreateTable
CREATE TABLE `item_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL,

    UNIQUE INDEX `item_types_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `name` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `typeId` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `sell_price` INTEGER NOT NULL DEFAULT 0,
    `max_stack_size` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('Player', 'Guild') NOT NULL,
    `ownerId` INTEGER NOT NULL,
    `size` INTEGER NOT NULL DEFAULT 20,

    UNIQUE INDEX `inventories_ownerId_key`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_slots` (
    `slot` INTEGER NOT NULL,
    `inventoryId` INTEGER NOT NULL,
    `itemId` VARCHAR(191) NULL,

    PRIMARY KEY (`slot`, `inventoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `item_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_slots` ADD CONSTRAINT `inventory_slots_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_slots` ADD CONSTRAINT `inventory_slots_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `items`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
