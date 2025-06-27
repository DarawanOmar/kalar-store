-- AlterTable
ALTER TABLE `purchase_invoice` ADD COLUMN `is_cancle` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `sale_invoice` ADD COLUMN `is_cancle` BOOLEAN NOT NULL DEFAULT false;
