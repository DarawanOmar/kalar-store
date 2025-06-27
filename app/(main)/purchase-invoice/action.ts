"use server";

import db from "@/lib/prisma";
import { handlePrismaError } from "@/lib/utils";
import { getSession } from "@/lib/utils/cookies";

export const returnItemPurchaseInvoice = async (
  purchase_invoice_item_id: number,
  product_id: number,
  quantity_returned: number
) => {
  try {
    if (quantity_returned <= 0) {
      return {
        message: "بڕی گەڕاندنەوە دەبێت زیاتر بێت لە سفر",
        success: false,
      };
    }

    const purchase_invoice_item = await db.purchase_invoice_items.findUnique({
      where: { id: purchase_invoice_item_id },
      select: {
        id: true,
        quantity: true,
        product_id: true,
        unit_price: true,
        product_name: true,
        Products: {
          select: {
            id: true,
            quantity: true,
            name: true,
          },
        },
      },
    });

    if (!purchase_invoice_item) {
      return {
        message: "ئەم وەسڵە بوونی نییە",
        success: false,
      };
    }

    if (!purchase_invoice_item.Products) {
      return {
        message: "کاڵایەکە بەردەست نییە",
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

    const user = await getSession();
    if (!user) {
      return {
        message: "تکایە تۆکەنەکە دووبارە بکەوە",
        success: false,
      };
    }
    const email = user.token.split(",between,")[1];

    const return_amount = purchase_invoice_item.unit_price * quantity_returned;

    await db.$transaction(async (tx) => {
      if (quantity_returned === purchase_invoice_item.quantity) {
        await tx.purchase_invoice_items.delete({
          where: {
            id: purchase_invoice_item_id,
          },
        });
      } else {
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
      }

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

      await tx.mainCash.update({
        where: {
          id: 1,
        },
        data: {
          amount: {
            increment: return_amount,
          },
          last_amount: return_amount,
          type_action: "deposit",
        },
      });

      await tx.historyMainCash.create({
        data: {
          user_email: email,
          name: `گەڕاندنەوەی کاڵا: ${purchase_invoice_item.product_name}`,
          amount: return_amount,
          type_action: "deposit",
          added_by: "person",
        },
      });
    });

    return {
      message: `کاڵایەکە بە سەرکەوتوی گەڕایەوە - بڕی گەڕاو: ${quantity_returned} - بڕی پارە: ${return_amount}`,
      success: true,
      data: {
        returned_quantity: quantity_returned,
        return_amount: return_amount,
        product_name: purchase_invoice_item.product_name,
      },
    };
  } catch (error) {
    return handlePrismaError(error);
  }
};
