/*
  Warnings:

  - A unique constraint covering the columns `[userSkillId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `mana` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `userSkillId` INTEGER NULL,
    MODIFY `password` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `type_id` VARCHAR(191) NOT NULL,
    `power` INTEGER NOT NULL,
    `userSkillId` INTEGER NULL,

    UNIQUE INDEX `skill_name_key`(`name`),
    UNIQUE INDEX `skill_userSkillId_key`(`userSkillId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `skillId` INTEGER NOT NULL,
    `level` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mob` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `health` BIGINT NOT NULL,
    `mana` BIGINT NOT NULL DEFAULT 0,
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mob_skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mobId` INTEGER NULL,
    `skillId` INTEGER NOT NULL,
    `level` INTEGER NOT NULL,

    UNIQUE INDEX `mob_skill_mobId_key`(`mobId`),
    UNIQUE INDEX `mob_skill_skillId_key`(`skillId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order` INTEGER NOT NULL,
    `battleareaId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room_bom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `MobId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,

    UNIQUE INDEX `room_bom_MobId_key`(`MobId`),
    UNIQUE INDEX `room_bom_roomId_key`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mob_enity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `health` BIGINT NOT NULL,
    `mana` BIGINT NOT NULL,
    `mobId` INTEGER NOT NULL,
    `battleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battle_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `battleId` INTEGER NOT NULL,
    `mobEntityId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `skillId` INTEGER NULL,
    `actionText` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `battle_log_mobEntityId_key`(`mobEntityId`),
    UNIQUE INDEX `battle_log_userId_key`(`userId`),
    UNIQUE INDEX `battle_log_skillId_key`(`skillId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battle_area_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `level` INTEGER NULL,
    `isAcitve` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `battleareaId` INTEGER NULL,
    `isActive` BOOLEAN NULL,
    `userId` INTEGER NULL,

    UNIQUE INDEX `battle_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_userSkillId_key` ON `users`(`userSkillId`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_userSkillId_fkey` FOREIGN KEY (`userSkillId`) REFERENCES `user_skill`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skill` ADD CONSTRAINT `skill_userSkillId_fkey` FOREIGN KEY (`userSkillId`) REFERENCES `user_skill`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mob_skill` ADD CONSTRAINT `mob_skill_mobId_fkey` FOREIGN KEY (`mobId`) REFERENCES `mob`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mob_skill` ADD CONSTRAINT `mob_skill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `skill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room` ADD CONSTRAINT `room_battleareaId_fkey` FOREIGN KEY (`battleareaId`) REFERENCES `battle_area_settings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_bom` ADD CONSTRAINT `room_bom_MobId_fkey` FOREIGN KEY (`MobId`) REFERENCES `mob`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_bom` ADD CONSTRAINT `room_bom_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mob_enity` ADD CONSTRAINT `mob_enity_mobId_fkey` FOREIGN KEY (`mobId`) REFERENCES `mob`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mob_enity` ADD CONSTRAINT `mob_enity_battleId_fkey` FOREIGN KEY (`battleId`) REFERENCES `battle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battle_log` ADD CONSTRAINT `battle_log_battleId_fkey` FOREIGN KEY (`battleId`) REFERENCES `battle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battle_log` ADD CONSTRAINT `battle_log_mobEntityId_fkey` FOREIGN KEY (`mobEntityId`) REFERENCES `mob_enity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battle_log` ADD CONSTRAINT `battle_log_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battle_log` ADD CONSTRAINT `battle_log_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `skill`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battle` ADD CONSTRAINT `battle_battleareaId_fkey` FOREIGN KEY (`battleareaId`) REFERENCES `battle_area_settings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battle` ADD CONSTRAINT `battle_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
