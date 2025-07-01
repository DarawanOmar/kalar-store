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
            discount: true,
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

      if (sale_invoice_item.Sale_invoice) {
        const invoice = sale_invoice_item.Sale_invoice;
        let total_invoice_amount = invoice?.total_amount || 0;
        let paid_amount = invoice?.paid_amount || 0;
        let remaining_amount = invoice?.remaining_amount || 0;
        const is_fully_unpaid_invoice =
          paid_amount === 0 && remaining_amount === remaining_amount;

        const new_total_amount = (invoice.total_amount || 0) - return_amount;

        let mainCash_deduction = 0;

        if (invoice.type === "cash") {
          mainCash_deduction = return_amount - invoice.discount!;
        } else if (invoice.type === "loan") {
          if (is_fully_unpaid_invoice) {
            mainCash_deduction = 0;
          } else if (paid_amount === total_invoice_amount) {
            mainCash_deduction = return_amount;
            paid_amount = paid_amount - return_amount;
          } else if (return_amount <= remaining_amount) {
            remaining_amount -= return_amount;
            mainCash_deduction = 0;
          } else {
            let remedy_amount = return_amount - remaining_amount;
            remaining_amount = 0;
            paid_amount = paid_amount - remedy_amount;
            mainCash_deduction = remedy_amount;
          }
        }
        await tx.mainCash.update({
          where: { id: 1 },
          data: {
            amount: {
              decrement: mainCash_deduction,
            },
            last_amount: mainCash_deduction,
            type_action: "withdraw",
          },
        });

        await tx.historyMainCash.create({
          data: {
            user_email: email,
            name: `گەڕاندنەوەی فرۆشتن: ${sale_invoice_item.product_name} (${
              invoice.type === "cash" ? "کاش" : "قەرز"
            })`,
            amount: mainCash_deduction,
            type_action: "withdraw",
            added_by: "person",
          },
        });
        await tx.sale_invoice.update({
          where: {
            id: invoice.id!,
          },
          data: {
            total_amount: new_total_amount,
            paid_amount: paid_amount,
            remaining_amount: remaining_amount,
          },
        });
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

export const deleteSaleInvoiceItem = async (sale_invoice_item_id: number) => {
  try {
    const sale_invoice_item = await db.sale_invoice_items.findUnique({
      where: { id: sale_invoice_item_id },
      select: {
        id: true,
        quantity: true,
        product_id: true,
        unit_price: true,
        product_name: true,
        Sale_invoice: {
          select: {
            id: true,
            total_amount: true,
            type: true,
            paid_amount: true,
            discount: true,
            Sale_invoice_items: {
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

    if (!sale_invoice_item) {
      return {
        message: "ئەم وەسڵە بوونی نییە",
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

    const total_item_amount_returned =
      sale_invoice_item.unit_price * sale_invoice_item.quantity;

    const total_item_amount = sale_invoice_item.Sale_invoice?.total_amount;

    const isLastItem =
      sale_invoice_item.Sale_invoice?.Sale_invoice_items.length === 1;

    const isFullInvoiceAmount =
      total_item_amount === total_item_amount_returned;

    if (
      sale_invoice_item.Sale_invoice?.type === "loan" &&
      sale_invoice_item.Sale_invoice.paid_amount > 0
    ) {
      return {
        message:
          "ناتوانیت هیچ کام لە بەرهەکان بسڕیتەوە چونکە پارەی قەرزی دراوەتەوە لەم وەسڵە دەتوانی گەڕانەوە بکەی",
        success: false,
      };
    }

    await db.$transaction(async (tx) => {
      // Delete the sale invoice item
      await tx.sale_invoice_items.delete({
        where: {
          id: sale_invoice_item_id,
        },
      });

      if (isLastItem || isFullInvoiceAmount) {
        await tx.sale_invoice.delete({
          where: {
            id: sale_invoice_item.Sale_invoice?.id!,
          },
        });
      }
      let mainCash_deduction = 0;

      if (sale_invoice_item.Sale_invoice?.type === "cash") {
        mainCash_deduction =
          total_item_amount_returned - sale_invoice_item.Sale_invoice.discount!;
      } else if (sale_invoice_item.Sale_invoice?.type === "loan") {
        mainCash_deduction = 0;
      }

      await tx.products.update({
        where: {
          id: sale_invoice_item.product_id!,
        },
        data: {
          quantity: {
            increment: sale_invoice_item.quantity,
          },
        },
      });

      if (!isLastItem || !isFullInvoiceAmount) {
        await tx.sale_invoice.update({
          where: {
            id: sale_invoice_item.Sale_invoice?.id!,
          },
          data: {
            total_amount: {
              decrement: total_item_amount_returned,
            },
          },
        });
      }
      await tx.mainCash.update({
        where: {
          id: 1,
        },
        data: {
          amount: {
            decrement: mainCash_deduction,
          },
          last_amount: mainCash_deduction,
          type_action: "withdraw",
        },
      });

      // Create history record for the deletion
      await tx.historyMainCash.create({
        data: {
          user_email: email,
          name: `سڕینەوەی لە وەسڵەی فرۆشتن بۆ: ${sale_invoice_item.product_name}`,
          amount: mainCash_deduction,
          type_action: "withdraw",
          added_by: "person",
        },
      });
    });

    return {
      message: `وەسڵەی فرۆشتن بە سەرکەوتوی سڕایەوە - کاڵا: ${sale_invoice_item.product_name} - بڕی پارەی گەڕاو: ${total_item_amount_returned}`,
      success: true,
      data: {
        deleted_item_id: sale_invoice_item_id,
        product_name: sale_invoice_item.product_name,
        quantity: sale_invoice_item.quantity,
        refunded_amount: total_item_amount_returned,
      },
    };
  } catch (error) {
    return {
      message: handlePrismaError(error).message || "هەڵەیەک هەیە",
      success: false,
    };
  }
};
