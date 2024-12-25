/*
  Warnings:

  - Added the required column `is_done` to the `Sale_invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale_invoice" ADD COLUMN     "is_done" BOOLEAN NOT NULL;
