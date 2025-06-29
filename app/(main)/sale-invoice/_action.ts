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

      if (sale_invoice_item.Sale_invoice) {
        const invoice = sale_invoice_item.Sale_invoice;
        const new_total_amount =
          (sale_invoice_item.Sale_invoice.total_amount || 0) - return_amount;

        let mainCash_deduction = 0;

        if (invoice.type === "cash") {
          mainCash_deduction = return_amount;
        } else if (invoice.type === "loan") {
          if (invoice.total_amount && invoice.total_amount > 0) {
            const paid_percentage = invoice.paid_amount / invoice.total_amount;
            mainCash_deduction = return_amount * paid_percentage;
          }
        }
        if (mainCash_deduction > 0) {
          await tx.mainCash.update({
            where: { id: 1 },
            data: {
              amount: {
                decrement: mainCash_deduction,
              },
              last_amount: Math.floor(mainCash_deduction),
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
        }

        if (new_total_amount <= 0) {
          console.log("Delete Running");
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
          console.log("Update Running");
          // new_total_amount  400,000
          // return_amount  240,000
          let new_paid_amount = invoice.paid_amount; // 200,000
          let new_remaining_amount = invoice.remaining_amount; // 200,000

          if (invoice.type === "cash") {
            new_paid_amount = new_paid_amount - return_amount;
            new_remaining_amount = new_total_amount - new_paid_amount;
          } else if (invoice.type === "loan") {
            // For loan: first reduce remaining_amount, then paid_amount if needed
            if (new_remaining_amount >= return_amount) {
              // Case 1: return_amount can be fully covered by remaining_amount
              new_remaining_amount -= return_amount;
              // paid_amount stays the same
            } else {
              // Case 2: return_amount exceeds remaining_amount
              const excess_amount = return_amount - new_remaining_amount;
              new_remaining_amount = 0;
              new_paid_amount = new_paid_amount - excess_amount;
            }

            // Recalculate remaining_amount to ensure consistency
            new_remaining_amount = new_total_amount - new_paid_amount;
          }

          await tx.sale_invoice.update({
            where: {
              id: sale_invoice_item.sale_invoiceId!,
            },
            data: {
              total_amount: new_total_amount,
              paid_amount: new_paid_amount,
              remaining_amount: new_remaining_amount,
              status: new_remaining_amount > 0 ? "remain" : "done",
            },
          });
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
            type: true,
            paid_amount: true,
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

    const total_item_amount =
      sale_invoice_item.Sale_invoice?.Sale_invoice_items.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
      );

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
          "ناتوانیت هیچ کام لە بەرهەکان بسڕیتەوە چونکە پارەی قەرزی دراوەتەوە لەم وەسڵە",
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
        mainCash_deduction = total_item_amount_returned;
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
    return handlePrismaError(error);
  }
};
