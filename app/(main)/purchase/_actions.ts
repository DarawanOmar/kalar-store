"use server";

import db from "@/lib/prisma";
import { addInvoice, addInvoiceType, addProductPurchaseType } from "./_type";
import { getSession } from "@/lib/utils/cookies";
import { handlePrismaError } from "@/lib/utils";

// ----------------------Get------------------------------

export const getunFinishedInvoice = async () => {
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
    return {
      message: "هەڵەیەک هەیە",
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
        Purchase_invoice_items: {
          select: {
            id: true,
            product_id: true,
            quantity: true,
            unit_price: true,
            product_barcode: true,
            product_name: true,
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
    const Products = res.Purchase_invoice_items.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.product_name || "",
      barcode: item.product_barcode || "",
      sale_price: item.unit_price || 0,
    }));

    const total = Products.reduce(
      (sum, product) => sum + product.quantity * product.sale_price,
      0
    );

    const resultFormatted = {
      invoice_number: res.invoice_number,
      name: res.name,
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
    return handlePrismaError(error);
  }
};

export const getProductByBarcode = async (barcode: string, name: string) => {
  try {
    const res = await db.products.findMany({
      where: {
        is_active: true,
        OR: [
          {
            barcode: {
              contains: barcode,
            },
          },
          {
            name: {
              contains: name,
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
    return handlePrismaError(error);
  }
};

// ----------------------POST------------------------------

export const addProductPurchaseAction = async (
  invoice_id: number,
  values: addProductPurchaseType
) => {
  try {
    const purchaseInvoice = await db.purchase_invoice.findUnique({
      where: { id: invoice_id },
    });
    if (!purchaseInvoice) {
      return {
        message: "ئەم وەسڵە بوونی نییە",
        success: false,
      };
    }

    await db.$transaction(async (tx) => {
      const product = await tx.products.findUnique({
        where: { id: values.id },
      });
      if (values.purchase_price) {
        await tx.products.update({
          where: { id: values.id },
          data: { purchase_price: values.purchase_price },
        });
      }
      const existItem = await tx.purchase_invoice_items.findFirst({
        where: {
          purchase_invoiceId: invoice_id,
          product_id: values.id,
        },
      });

      if (existItem) {
        await tx.purchase_invoice_items.update({
          where: { id: existItem.id },
          data: { quantity: { increment: values.quantity } },
        });
      } else {
        await tx.purchase_invoice_items.create({
          data: {
            purchase_invoiceId: invoice_id,
            product_id: values.id,
            quantity: values.quantity,
            unit_price: values.purchase_price,
            product_name: product?.name || "",
            product_barcode: product?.barcode || "",
          },
        });
      }
    });

    return {
      success: true,
      message: "بە سەرکەوتویی زیاد کرا",
    };
  } catch (error: any) {
    return handlePrismaError(error);
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
    const invoice = await db.purchase_invoice.create({
      data: {
        ...parasedData.data,
        is_done: false,
      },
    });
    return {
      success: true,
      data: invoice.id,
      message: "بە سەرکەوتویی زیاد کرا",
    };
  } catch (error) {
    return handlePrismaError(error);
  }
};

// ----------------------Delete------------------------------

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
    return handlePrismaError(error);
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
    return handlePrismaError(error);
  }
};

// ----------------------PUT------------------------------

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
      purchase_price: item.unit_price,
    }));

    // Use a transaction for atomic updates
    await db.$transaction(async (tx) => {
      let total = 0;
      for (const { product_id, quantity, purchase_price } of productUpdates) {
        total += purchase_price * quantity;
        await tx.products.update({
          where: { id: product_id as number },
          data: { quantity: { increment: quantity } },
        });
      }
      await tx.mainCash.update({
        where: { id: 1 },
        data: {
          amount: { decrement: total },
          type_action: "withdraw",
          last_amount: total,
        },
      });
      const user = await getSession();
      if (!user) {
        return {
          message: "تکایە تۆکەنەکە دووبارە بکەوە",
          success: false,
        };
      }
      const email = user.token.split(",between,")[1];
      await tx.historyMainCash.create({
        data: {
          amount: total,
          type_action: "withdraw",
          added_by: "system",
          name: "کڕینی کاڵا",
          user_email: email,
        },
      });

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
    return handlePrismaError(error);
  }
};
