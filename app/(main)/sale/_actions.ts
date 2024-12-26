"use server";

import db from "@/lib/prisma";
import { addSale, addSaleType } from "./_type";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
        is_done: false,
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
        message: "ئەم بەرهەمە بوونی نییە",
        success: false,
      };
    }
    await db.sale_invoice_items.delete({
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
export const getAllUnfinishSaleInvoice = async () => {
  try {
    const res = await db.sale_invoice.findMany({
      where: {
        is_done: false,
      },
    });

    return {
      success: true,
      data: res,
    };
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "A duplicate entry error occurred.",
          success: false,
        };
      } else if (error.code === "P2001") {
        return {
          message: "No unfinished invoices found.",
          success: false,
        };
      }
    }
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
export const getOneSaleInvoice = async (id: number) => {
  try {
    if (!id) {
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
    const Products = res.Sale_invoice_items.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.Products?.name || "",
      barcode: item.Products?.barcode || "",
      sale_price: item.Products?.sale_price || 0,
    }));

    const total = Products.reduce(
      (sum, product) => sum + product.quantity * product.sale_price,
      0
    );

    const resultFormatted = {
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
    // Log concise error messages for better performance
    console.error("Database error:", error.message);
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const addProductSaleAction = async (
  invoice_id: number,
  product_id: number,
  quantity: number
) => {
  try {
    await db.sale_invoice_items.create({
      data: {
        sale_invoiceId: invoice_id,
        product_id: product_id,
        quantity: quantity,
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

export const completeSaleInvoiceAction = async (
  id: number,
  diccount: number | undefined
) => {
  try {
    // Fetch the sale invoice and its items in a single query
    const saleInvoice = await db.sale_invoice.findUnique({
      where: { id },
      include: { Sale_invoice_items: true },
    });

    if (!saleInvoice) {
      return {
        message: "ئەم وەسكە بوونی نییە",
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
      for (const { product_id, quantity } of productUpdates) {
        if (product_id) {
          // Decrement the quantity of the product
          const product = await tx.products.findUnique({
            where: { id: product_id },
          });

          if (!product) {
            throw new Error(`Product with ID ${product_id} not found`);
          }

          if (product.quantity < quantity) {
            throw new Error(
              `Insufficient quantity for product ID ${product_id}. Available: ${product.quantity}, Requested: ${quantity}`
            );
          }

          await tx.products.update({
            where: { id: product_id },
            data: { quantity: { decrement: quantity } },
          });
        }
      }

      // Mark the sale invoice as done
      await tx.sale_invoice.update({
        where: { id },
        data: { is_done: true, discount: diccount },
      });
    });

    return {
      success: true,
      message: "بە سەرکەوتویی تەواوکرایەوە",
    };
  } catch (error) {
    return {
      message: `هەڵەیەک هەیە`,
      success: false,
    };
  }
};
