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

    if (purchase_invoice_item.Products.quantity < quantity_returned) {
      return {
        message: "بڕی گەڕاندنەوە زیاترە لە بڕی بەردەست",
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

export const deletePurchaseInvoiceItem = async (
  purchase_invoice_item_id: number
) => {
  try {
    // Check if the purchase invoice item exists
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
            quantity: true,
            id: true,
            name: true,
          },
        },
        Purchase_invoice: {
          select: {
            id: true,
            Purchase_invoice_items: {
              select: {
                id: true,
                unit_price: true,
                quantity: true,
              },
            },
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

    // check have the product in stock
    if (
      purchase_invoice_item.Products?.quantity! < purchase_invoice_item.quantity
    ) {
      return {
        message: "بڕی وەسڵەکە زیاترە لە بڕی بەردەست",
        success: false,
      };
    }

    // Get user session for logging
    const user = await getSession();
    if (!user) {
      return {
        message: "تکایە تۆکەنەکە دووبارە بکەوە",
        success: false,
      };
    }
    const email = user.token.split(",between,")[1];

    // Calculate the total amount that was spent on this item
    const total_item_amount =
      purchase_invoice_item.unit_price * purchase_invoice_item.quantity;

    // Calculate total amount of all items in the purchase invoice
    const total_invoice_amount =
      purchase_invoice_item.Purchase_invoice?.Purchase_invoice_items.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
      );

    // Check if this item represents the entire invoice amount
    const isLastItem =
      purchase_invoice_item.Purchase_invoice?.Purchase_invoice_items.length ===
      1;
    const isFullInvoiceAmount = total_item_amount === total_invoice_amount;

    await db.$transaction(async (tx) => {
      // Delete the purchase invoice item
      await tx.purchase_invoice_items.delete({
        where: {
          id: purchase_invoice_item_id,
        },
      });

      // If this was the last item or represents the full invoice amount, delete the entire invoice
      if (isLastItem || isFullInvoiceAmount) {
        await tx.purchase_invoice.delete({
          where: {
            id: purchase_invoice_item.Purchase_invoice?.id!,
          },
        });
      }

      await tx.products.update({
        where: {
          id: purchase_invoice_item.product_id!,
        },
        data: {
          quantity: {
            decrement: purchase_invoice_item.quantity,
          },
        },
      });

      // Add back the money to main cash (since we're removing the expense)
      await tx.mainCash.update({
        where: {
          id: 1,
        },
        data: {
          amount: {
            increment: total_item_amount,
          },
          last_amount: total_item_amount,
          type_action: "deposit",
        },
      });

      // Create history record for the deletion
      await tx.historyMainCash.create({
        data: {
          user_email: email,
          name: `سڕینەوەی ${
            isLastItem || isFullInvoiceAmount
              ? "پسوڵەی کڕین تەواو"
              : "وەسڵەی کڕین"
          }: ${purchase_invoice_item.product_name}`,
          amount: total_item_amount,
          type_action: "deposit",
          added_by: "person",
        },
      });
    });

    return {
      message: `وەسڵەی کڕین بە سەرکەوتوی سڕایەوە - کاڵا: ${purchase_invoice_item.product_name} - بڕی پارەی گەڕاو: ${total_item_amount}`,
      success: true,
      data: {
        deleted_item_id: purchase_invoice_item_id,
        product_name: purchase_invoice_item.product_name,
        quantity: purchase_invoice_item.quantity,
        refunded_amount: total_item_amount,
      },
    };
  } catch (error) {
    return handlePrismaError(error);
  }
};
