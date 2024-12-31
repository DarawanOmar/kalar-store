"use server";

import db from "@/lib/prisma";

export const returnItemSaleInvoice = async (
  sale_invoice_item_id: number,
  product_id: number,
  quantity_returned: number
) => {
  try {
    const sale_invoice_item = await db.sale_invoice_items.findUnique({
      where: { id: sale_invoice_item_id },
      select: {
        id: true,
        quantity: true,
        product_id: true,
      },
    });
    if (!sale_invoice_item) {
      return {
        message: "ئەم ڕیکۆردە بوونی نییە",
        success: false,
      };
    }
    if (sale_invoice_item.product_id !== product_id) {
      return {
        message: "ئەم کاڵایە بەردەست نییە",
        success: false,
      };
    }

    if (sale_invoice_item.quantity < quantity_returned) {
      return {
        message: "ئەم بڕە زیاترە لە بڕی فرۆشراو",
        success: false,
      };
    }
    if (quantity_returned === sale_invoice_item.quantity) {
      db.$transaction(async () => {
        await db.sale_invoice_items.delete({
          where: {
            id: sale_invoice_item_id,
          },
        });
        await db.products.update({
          where: {
            id: product_id,
          },
          data: {
            quantity: {
              increment: quantity_returned,
            },
          },
        });
      });
      return {
        message: "بەسەرکردنەوەی کاڵایەکە گەڕایەوە",
        success: true,
      };
    }
    db.$transaction(async () => {
      await db.sale_invoice_items.update({
        where: {
          id: sale_invoice_item_id,
        },
        data: {
          quantity: {
            decrement: quantity_returned,
          },
        },
      });
      await db.products.update({
        where: {
          id: product_id,
        },
        data: {
          quantity: {
            increment: quantity_returned,
          },
        },
      });
    });
    return {
      message: "کاڵایەکە بە سەرکەوتوی گەڕایەوە",
      success: true,
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
