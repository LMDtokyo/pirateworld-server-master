-- DropIndex
DROP INDEX `users_email_key` ON `users`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `email_confirmed` BOOLEAN NOT NULL DEFAULT false;
