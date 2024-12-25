"use server";

import db from "@/lib/prisma";
import { addInvoice, addInvoiceType } from "./_type";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const unFinishedInvoice = async () => {
  try {
    const res = await db.purchase_invoice.findMany({
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
    // Log the detailed error for debugging
    console.error("Error fetching unfinished invoices:", error.stack);

    // Handle specific Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Example: Unique constraint violation
        return {
          message: "A duplicate entry error occurred.",
          success: false,
        };
      } else if (error.code === "P2001") {
        // Example: Record not found
        return {
          message: "No unfinished invoices found.",
          success: false,
        };
      }
    }

    // Handle general errors
    return {
      message: "هەڵەیەک هەیە", // Kurdish: "An error occurred"
      success: false,
    };
  }
};

export const getOneInvoice = async (id: number) => {
  try {
    if (!id) {
      return {
        message: "ئەم وەسڵە بوونی نییە",
        success: false,
      };
    }
    const res = await db.purchase_invoice.findUnique({
      where: {
        id,
      },
      select: {
        invoice_number: true,
        name: true,
        place: true,
        note: true,
      },
    });
    if (!res) {
      return {
        message: "ئەم وەسڵە بوونی نییە",
        success: false,
      };
    }

    return {
      success: true,
      data: res,
    };
  } catch (error: any) {
    console.error("Error fetching invoice:", error.stack);
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const addInvoiceAction = async (values: addInvoiceType) => {
  try {
    const parasedData = addInvoice.safeParse(values);
    if (parasedData.success === false) {
      const errors = Object.entries(
        parasedData.error.flatten().fieldErrors
      ).map(([field, error]) => `${field}: ${error}`);
      return {
        message: errors.join(", "),
        success: false,
      };
    }
    await db.purchase_invoice.create({
      data: {
        ...parasedData.data,
        is_done: false,
      },
    });
    return {
      success: true,
      message: "بە سەرکەوتویی زیاد کرا",
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const deletePurchaseInvoiceAction = async (id: number) => {
  try {
    const existPurchase = await db.purchase_invoice.findUnique({
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
    const itemExist = await db.purchase_invoice_items.findMany({
      where: {
        purchase_invoiceId: id,
      },
    });
    if (itemExist.length > 0) {
      return {
        message: "ناتوانیت ئەم وەسڵە بسڕیتەوە چونکە کاڵاکانی تۆمارکراون",
        success: false,
      };
    }
    await db.purchase_invoice.delete({
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

export const addProductPurchaseAction = async (
  invoice_id: number,
  product_id: number,
  quantity: number
) => {
  console.log(
    "Invoice ID => ",
    invoice_id,
    "Product ID => ",
    product_id,
    "Qunatity => ",
    quantity
  );
  try {
    await db.purchase_invoice_items.create({
      data: {
        purchase_invoiceId: invoice_id,
        product_id: product_id,
        quantity: quantity,
      },
    });
    return {
      success: true,
      message: "بە سەرکەوتویی زیاد کرا",
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const getUnFinishPurchaseProducts = async (id: number) => {
  try {
    const res = await db.purchase_invoice_items.findMany({
      where: {
        purchase_invoiceId: id,
      },
      include: {
        Products: true,
        Purchase_invoice: true,
      },
    });
    return {
      success: true,
      data: res,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const getPurchasePorudcts = async (id: number) => {
  try {
    const res = await db.purchase_invoice_items.findMany({
      where: {
        purchase_invoiceId: id,
      },
      include: {
        Products: true,
      },
    });
    const products = res.map((item) => {
      return {
        id: item?.id,
        name: item.Products?.name,
        barcode: item.Products?.barcode,
        quantity: item.quantity,
        purchase_price: item.Products?.purchase_price,
      };
    });

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const deletePurchaseItemProdcut = async (id: number) => {
  try {
    const existItem = await db.purchase_invoice_items.findUnique({
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
    await db.purchase_invoice_items.delete({
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

export const completeInvoiceAction = async (id: number) => {
  try {
    // Fetch the purchase invoice and its items in a single query
    const purchaseInvoice = await db.purchase_invoice.findUnique({
      where: { id },
      include: { Purchase_invoice_items: true },
    });

    if (!purchaseInvoice) {
      return {
        message: "ئەم وەسكە بوونی نییە",
        success: false,
      };
    }

    const items = purchaseInvoice.Purchase_invoice_items;

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
          await tx.products.update({
            where: { id: product_id },
            data: { quantity: { increment: quantity } },
          });
        }
      }

      // Mark the purchase invoice as done
      await tx.purchase_invoice.update({
        where: { id },
        data: { is_done: true },
      });
    });

    return {
      success: true,
      message: "بە سەرکەوتویی تەواوکرایەوە",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const getProductByBarcode = async (barcode: string) => {
  try {
    const res = await db.products.findMany({
      where: {
        OR: [
          {
            barcode: {
              contains: barcode,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: barcode,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    return {
      success: true,
      data: res,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
