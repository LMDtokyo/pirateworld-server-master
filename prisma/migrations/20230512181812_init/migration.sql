-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(191) NOT NULL,
    `password` TEXT NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `avatar_hash` VARCHAR(191) NULL,
    `lvl` INTEGER NOT NULL DEFAULT 1,
    `hp` INTEGER NOT NULL DEFAULT 300,
    `exp` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `users_login_key`(`login`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_resources` (
    `userId` INTEGER NOT NULL,
    `real` INTEGER NOT NULL DEFAULT 0,
    `doubloon` INTEGER NOT NULL DEFAULT 0,
    `wood` INTEGER NOT NULL DEFAULT 0,
    `sugar` INTEGER NOT NULL DEFAULT 0,
    `rum` INTEGER NOT NULL DEFAULT 0,
    `clotch` INTEGER NOT NULL DEFAULT 0,
    `iron` INTEGER NOT NULL DEFAULT 0,
    `crystal` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users_resources` ADD CONSTRAINT `users_resources_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
