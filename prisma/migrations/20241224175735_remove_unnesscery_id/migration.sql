/*
  Warnings:

  - You are about to drop the column `productsId` on the `Purchase_invoice_items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Purchase_invoice_items" DROP CONSTRAINT "Purchase_invoice_items_productsId_fkey";

-- AlterTable
ALTER TABLE "Purchase_invoice_items" DROP COLUMN "productsId",
ALTER COLUMN "product_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Purchase_invoice_items" ADD CONSTRAINT "Purchase_invoice_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
