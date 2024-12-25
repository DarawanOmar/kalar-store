"use server";

import db from "@/lib/prisma";
import { addProduct, addProductType } from "./_type";
import { utapi } from "@/server/uploadthing";

export const getAllProducts = async (search: string, page: number) => {
  const pageSize = 10;
  let where = {};
  if (search) {
    where = {
      OR: [{ name: { contains: search } }, { barcode: { contains: search } }],
    };
  }

  const produts = await db.products.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { barcode: { contains: search, mode: "insensitive" } },
      ],
    },
    take: 10,
    skip: (page - 1) * pageSize,
    orderBy: { id: "desc" },
  });
  return produts;
};
export const addProducts = async (values: addProductType) => {
  try {
    const parasedData = addProduct.safeParse(values);
    if (parasedData.success === false) {
      const errors = Object.entries(
        parasedData.error.flatten().fieldErrors
      ).map(([field, error]) => `${field}: ${error}`);
      return {
        message: errors.join(", "),
        success: false,
      };
    }

    await db.products.create({
      data: { ...parasedData.data, quantity: 0 },
    });
    return {
      message: "بە سەرکەوتویی زیاد کرا",
      success: true,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
export const updateProducts = async (id: number, values: addProductType) => {
  try {
    const parasedData = addProduct.safeParse(values);
    if (parasedData.success === false) {
      const errors = Object.entries(
        parasedData.error.flatten().fieldErrors
      ).map(([field, error]) => `${field}: ${error}`);
      return {
        message: errors.join(", "),
        success: false,
      };
    }
    await db.products.update({
      data: {
        ...parasedData.data,
      },
      where: { id },
    });
    return {
      message: "بە سەرکەوتویی نوێکرایەوە",
      success: true,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
export const deleteProducts = async (id: number) => {
  try {
    const product = await db.products.findUnique({
      where: { id },
    });
    if (!product) {
      return {
        message: "ببورە، ئەم کاڵایە بوونی نییە",
        success: false,
      };
    }
    const url = product.image as string;
    if (url) {
      const key = url.split("/").pop();
      await deleteIamge(key as string);
    }

    await db.products.delete({
      where: { id },
    });
    return {
      message: "بە سەرکەوتویی سڕایەوە",
      success: true,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const deleteIamge = async (imageKey: string) => {
  try {
    await utapi.deleteFiles(imageKey);
    return {
      message: "بە سەرکەوتویی سڕایەوە",
      success: true,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
