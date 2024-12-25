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
    console.log("Error => ", error?.message);
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const completeSaleInvoiceAction = async (
  discount: number | undefined,
  id: number
) => {
  try {
    const existPurchase = await db.sale_invoice.findUnique({
      where: {
        id,
      },
    });
    if (!existPurchase) {
      return {
        message: "ئەم وەسڵە بوونی نییە",
        success: false,
      };
    }
    await db.sale_invoice.update({
      where: {
        id,
      },
      data: {
        is_done: true,
        discount: discount ? discount : 0,
      },
    });
    return {
      success: true,
      message: "بە سەرکەوتویی تەواوکرایەوە",
    };
  } catch (error) {
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
    console.log(error.message);
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
