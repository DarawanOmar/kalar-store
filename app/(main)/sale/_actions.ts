"use server";

import db from "@/lib/prisma";
import { addSale, addSaleType } from "./_type";
import { Type_Sale_Purchase } from "@prisma/client";

// ------------------------DELETE---------------------------
export const deleteEmptySaleInvoice = async (id: number) => {
  try {
    const existPurchase = await db.sale_invoice.findUnique({
      where: {
        id,
      },
    });
    if (!existPurchase) {
      return {
        message: "ئەم فاکتۆرە بوونی نییە",
        success: false,
      };
    }
    const itemExist = await db.sale_invoice_items.findMany({
      where: {
        sale_invoiceId: id,
      },
    });
    if (itemExist.length > 0) {
      return {
        message: "ناتوانیت ئەم وەسڵە بسڕیتەوە چونکە کاڵاکانی تۆمارکراون",
        success: false,
      };
    }
    await db.sale_invoice.delete({
      where: {
        id,
      },
    });
    return {
      success: true,
      message: "بە سەرکەوتویی سڕایەوە",
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const deleteSaleItemProdcut = async (id: number) => {
  try {
    const existItem = await db.sale_invoice_items.findUnique({
      where: {
        id,
      },
    });
    if (!existItem) {
      return {
        message: "ئەم وەسڵە بوونی نییە",
        success: false,
      };
    }

    db.$transaction(async (tx) => {
      await tx.products.update({
        where: { id: existItem.product_id as number },
        data: { quantity: { increment: existItem.quantity } },
      });
      await db.sale_invoice_items.delete({
        where: {
          id,
        },
      });
    });

    return {
      success: true,
      message: "بە سەرکەوتویی سڕایەوە",
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

// ------------------------GET---------------------------

export const getAllUnfinishSaleInvoice = async () => {
  try {
    const res = await db.sale_invoice.findMany({
      where: {
        is_done: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: res,
    };
  } catch (error: any) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
export const getOneSaleInvoice = async (id: number) => {
  try {
    if (!id || id <= 0) {
      return {
        message: "ئەم وەسڵە بوونی نییە",
        success: false,
      };
    }

    // Fetch only necessary fields
    const res = await db.sale_invoice.findUnique({
      where: {
        id,
      },
      select: {
        type: true,
        invoice_number: true,
        name: true,
        place: true,
        phone: true,
        note: true,
        Sale_invoice_items: {
          select: {
            id: true,
            product_id: true,
            quantity: true,
            Products: {
              select: {
                name: true,
                barcode: true,
                sale_price: true,
              },
            },
          },
        },
      },
    });

    if (!res) {
      return {
        message: "ئەم وەسڵە بوونی نییە",
        success: false,
      };
    }

    // Transform data and calculate total
    const Products = await Promise.all(
      res.Sale_invoice_items.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        name: item.Products?.name || "",
        barcode: item.Products?.barcode || "",
        sale_price: item.Products?.sale_price || 0,
      }))
    );
    const total = Products.reduce(
      (sum, product) => sum + product.quantity * product.sale_price,
      0
    );

    const resultFormatted = {
      type: res.type,
      invoice_number: res.invoice_number,
      name: res.name,
      phone: res.phone,
      place: res.place,
      note: res.note,
      Products,
      total,
    };

    return {
      success: true,
      data: resultFormatted,
    };
  } catch (error: any) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

// ----------------------POST-------------------------

export const addProductSaleAction = async (
  invoice_id: number,
  product_id: number,
  quantity: number
) => {
  try {
    const product = await db.products.findUnique({
      where: { id: product_id },
    });

    if (!product) {
      return {
        message: "ئەم کاڵایە بوونی نییە",
        success: false,
      };
    }

    if (product.quantity === 0) {
      return {
        message: "ئەم کاڵایە بەردەست نییە",
        success: false,
      };
    }

    if (product.quantity < quantity) {
      return {
        message: `${product.quantity}بڕی کاڵای بەردەست  `,
        success: false,
      };
    }
    db.$transaction(async (tx) => {
      const sale_invoice = await tx.sale_invoice.findUnique({
        where: { id: invoice_id },
      });

      await tx.sale_invoice.update({
        where: { id: invoice_id },
        data: {
          total_amount: { increment: product.sale_price * quantity },
          remaining_amount:
            sale_invoice?.type === "cash"
              ? 0
              : { increment: product.sale_price * quantity },
        },
      });
      await tx.products.update({
        where: { id: product_id },
        data: { quantity: { decrement: quantity } },
      });
      // if product exist in the invoice update the quantity
      const existItem = await tx.sale_invoice_items.findFirst({
        where: {
          sale_invoiceId: invoice_id,
          product_id: product_id,
        },
      });
      if (existItem) {
        await tx.sale_invoice_items.update({
          where: { id: existItem.id },
          data: { quantity: { increment: quantity } },
        });
        return;
      }
      // if product not exist in the invoice create new item
      await tx.sale_invoice_items.create({
        data: {
          sale_invoiceId: invoice_id,
          product_id: product_id,
          quantity: quantity,
        },
      });
    });
    return {
      success: true,
      message: "بە سەرکەوتویی زیاد کرا",
    };
  } catch (error: any) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
export const createSaleInvoice = async (values: addSaleType) => {
  try {
    const parasedData = addSale.safeParse(values);
    if (parasedData.success === false) {
      const errors = Object.entries(
        parasedData.error.flatten().fieldErrors
      ).map(([field, error]) => `${field}: ${error}`);
      return {
        message: errors.join(", "),
        success: false,
      };
    }
    await db.sale_invoice.create({
      data: {
        ...parasedData.data,
        type: parasedData.data.type as Type_Sale_Purchase,
        is_done: false,
        total_amount: 0,
        discount: 0,
      },
    });
    return {
      success: true,
      message: "بە سەرکەوتویی زیاد کرا",
    };
  } catch (error: any) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

// ----------------------PUT-------------------------

export const completeSaleInvoiceAction = async (
  id: number,
  diccount: number | undefined,
  amount_payment: number
) => {
  try {
    // Fetch the sale invoice and its items in a single query
    const saleInvoice = await db.sale_invoice.findUnique({
      where: { id },
      include: { Sale_invoice_items: true },
    });

    if (!saleInvoice) {
      return {
        message: "ئەم وەسڵە بوونی نییە",
        success: false,
      };
    }

    const items = saleInvoice.Sale_invoice_items;

    if (items.length === 0) {
      return {
        message: "ئەم وەسڵە هیچ کاڵایەکی تێدا تۆمارنەکراوە",
        success: false,
      };
    }

    // Fetch all product IDs and quantities in a single query
    const productUpdates = items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    // Use a transaction for atomic updates
    await db.$transaction(async (tx) => {
      for (const { product_id } of productUpdates) {
        if (product_id) {
          // Decrement the quantity of the product
          const product = await tx.products.findUnique({
            where: { id: product_id },
          });

          if (!product) {
            throw new Error(`کاڵایەک بوونی نییە `);
          }
        }
      }
      let is_discount;
      if (diccount) {
        is_discount = true;
      } else {
        is_discount = false;
      }

      // decrease amount in main-cash
      if (
        saleInvoice.type === "cash" ||
        (saleInvoice.type === "loan" && amount_payment)
      ) {
        await tx.mainCash.update({
          where: { id: 1 },
          data: {
            amount: {
              increment:
                saleInvoice.type === "cash"
                  ? (saleInvoice.total_amount as number)
                  : amount_payment,
            },
            last_amount: {
              increment:
                saleInvoice.type === "cash"
                  ? (saleInvoice.total_amount as number)
                  : amount_payment,
            },
            type_action: "deposit",
          },
        });
      }

      // Mark the sale invoice as done
      await tx.sale_invoice.update({
        where: { id },
        data: {
          is_done: true,
          discount: diccount,
          is_discount: is_discount,
          paid_amount: amount_payment || 0,
          remaining_amount: amount_payment
            ? (saleInvoice.total_amount as number) - amount_payment
            : (saleInvoice.total_amount as number),
        },
      });
    });

    return {
      success: true,
      message: "بە سەرکەوتویی تەواوکرایەوە",
    };
  } catch (error: any) {
    console.log("Error => ", error.message);
    return {
      message: `هەڵەیەک هەیە : ${error.message}`,
      success: false,
    };
  }
};
