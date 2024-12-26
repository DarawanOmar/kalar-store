/*
  Warnings:

  - You are about to drop the column `productsId` on the `Sale_invoice_items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sale_invoice_items" DROP CONSTRAINT "Sale_invoice_items_productsId_fkey";

-- AlterTable
ALTER TABLE "Sale_invoice_items" DROP COLUMN "productsId",
ALTER COLUMN "product_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Sale_invoice_items" ADD CONSTRAINT "Sale_invoice_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
