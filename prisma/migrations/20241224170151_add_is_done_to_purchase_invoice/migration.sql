/*
  Warnings:

  - Added the required column `is_done` to the `Purchase_invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchase_invoice" ADD COLUMN     "is_done" BOOLEAN NOT NULL;
