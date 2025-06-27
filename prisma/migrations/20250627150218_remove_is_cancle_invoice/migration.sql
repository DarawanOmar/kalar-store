/*
  Warnings:

  - You are about to drop the column `is_cancle` on the `purchase_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `is_cancle` on the `sale_invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `purchase_invoice` DROP COLUMN `is_cancle`;

-- AlterTable
ALTER TABLE `sale_invoice` DROP COLUMN `is_cancle`;
