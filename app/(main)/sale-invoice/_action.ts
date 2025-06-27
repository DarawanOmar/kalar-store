"use server";

import db from "@/lib/prisma";
import { handlePrismaError } from "@/lib/utils";
import { getSession } from "@/lib/utils/cookies";

export const returnItemSaleInvoice = async (
  sale_invoice_item_id: number,
  product_id: number,
  quantity_returned: number
) => {
  try {
    const user = await getSession();
    if (!user) {
      return {
        message: "تکایە تۆکەنەکە دووبارە بکەوە",
        success: false,
      };
    }
    const email = user.token.split(",between,")[1];

    if (quantity_returned <= 0) {
      return {
        message: "بڕی گەڕاندنەوە دەبێت زیاتر بێت لە سفر",
        success: false,
      };
    }

    const sale_invoice_item = await db.sale_invoice_items.findUnique({
      where: { id: sale_invoice_item_id },
      select: {
        id: true,
        quantity: true,
        product_id: true,
        unit_price: true,
        product_name: true,
        sale_invoiceId: true,
        Products: {
          select: {
            id: true,
            quantity: true,
            name: true,
          },
        },
        Sale_invoice: {
          select: {
            id: true,
            total_amount: true,
            paid_amount: true,
            remaining_amount: true,
            type: true,
            status: true,
            note: true,
          },
        },
      },
    });

    if (!sale_invoice_item) {
      return {
        message: "ئەم ڕیکۆردە بوونی نییە",
        success: false,
      };
    }

    if (!sale_invoice_item.Products) {
      return {
        message: "کاڵایەکە بەردەست نییە",
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

    const return_amount = sale_invoice_item.unit_price * quantity_returned;

    await db.$transaction(async (tx) => {
      if (quantity_returned === sale_invoice_item.quantity) {
        await tx.sale_invoice_items.delete({
          where: {
            id: sale_invoice_item_id,
          },
        });
      } else {
        await tx.sale_invoice_items.update({
          where: {
            id: sale_invoice_item_id,
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
            increment: quantity_returned,
          },
        },
      });

      await tx.mainCash.update({
        where: { id: 1 },
        data: {
          amount: {
            decrement: return_amount,
          },
          last_amount: return_amount,
          type_action: "withdraw",
        },
      });

      await tx.historyMainCash.create({
        data: {
          user_email: email,
          name: `گەڕاندنەوەی فرۆشتن: ${sale_invoice_item.product_name}`,
          amount: return_amount,
          type_action: "withdraw",
          added_by: "person",
        },
      });

      if (sale_invoice_item.Sale_invoice) {
        const new_total_amount =
          (sale_invoice_item.Sale_invoice.total_amount || 0) - return_amount;

        if (new_total_amount <= 0) {
          await tx.loanPayment.deleteMany({
            where: {
              sale_invoiceId: sale_invoice_item.sale_invoiceId!,
            },
          });

          await tx.sale_invoice.delete({
            where: {
              id: sale_invoice_item.sale_invoiceId!,
            },
          });
        } else {
          let new_paid_amount = sale_invoice_item.Sale_invoice.paid_amount;
          let new_remaining_amount =
            sale_invoice_item.Sale_invoice.remaining_amount;

          if (sale_invoice_item.Sale_invoice.type === "loan") {
            if (new_remaining_amount >= return_amount) {
              new_remaining_amount -= return_amount;
            } else {
              new_remaining_amount = 0;
              new_paid_amount = 0;
            }
          }
        }
      }
    });
    return {
      message: `کاڵایەکە بە سەرکەوتوی گەڕایەوە - بڕی گەڕاو: ${quantity_returned} - بڕی پارە: ${return_amount}`,
      success: true,
      data: {
        returned_quantity: quantity_returned,
        return_amount: return_amount,
        product_name: sale_invoice_item.product_name,
      },
    };
  } catch (error) {
    return handlePrismaError(error);
  }
};
