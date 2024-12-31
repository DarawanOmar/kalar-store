"use server";

import db from "@/lib/prisma";

export const returnItemPurchaseInvoice = async (
  purchase_invoice_item_id: number,
  product_id: number,
  quantity_returned: number
) => {
  try {
    const purchase_invoice_item = await db.purchase_invoice_items.findUnique({
      where: { id: purchase_invoice_item_id },
      select: {
        id: true,
        quantity: true,
        product_id: true,
        Products: {
          select: {
            quantity: true,
          },
        },
      },
    });
    if (!purchase_invoice_item) {
      return {
        message: "ئەم ڕیکۆردە بوونی نییە",
        success: false,
      };
    }
    if (purchase_invoice_item.product_id !== product_id) {
      return {
        message: "ئەم کاڵایە بەردەست نییە",
        success: false,
      };
    }

    if (quantity_returned > purchase_invoice_item.quantity) {
      return {
        message: "ئەم بڕە زیاترە لە بڕی کڕاو",
        success: false,
      };
    }
    if (!purchase_invoice_item.Products) {
      return {
        message: "کاڵایەکە بەردەست نییە",
        success: false,
      };
    }
    if (purchase_invoice_item.Products.quantity === 0) {
      return {
        message: "ئەم بەرهەمە گشتی فرۆشراوە",
        success: false,
      };
    }
    if (quantity_returned > purchase_invoice_item.Products.quantity) {
      const quantitiesInStock = purchase_invoice_item.Products.quantity;
      const quantitiesInInvoice = purchase_invoice_item.quantity;
      const SaledQuantities = quantitiesInInvoice - quantitiesInStock;
      return {
        message: ` ئەم بەرهەمە  ${SaledQuantities}دانە لێی فرۆشراو `,
        success: false,
      };
    }
    if (
      purchase_invoice_item.quantity ===
      purchase_invoice_item?.Products?.quantity
    ) {
      await db.$transaction(async (tx) => {
        await tx.purchase_invoice_items.delete({
          where: {
            id: purchase_invoice_item_id,
          },
        });
        await tx.products.update({
          where: {
            id: product_id,
          },
          data: {
            quantity: {
              decrement: quantity_returned,
            },
          },
        });
      });
      return {
        message: "بەسەرکردنەوەی کاڵایەکە گەڕایەوە",
        success: true,
      };
    }
    await db.$transaction(async (tx) => {
      await tx.purchase_invoice_items.update({
        where: {
          id: purchase_invoice_item_id,
        },
        data: {
          quantity: {
            decrement: quantity_returned,
          },
        },
      });
      await tx.products.update({
        where: {
          id: product_id,
        },
        data: {
          quantity: {
            decrement: quantity_returned,
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
