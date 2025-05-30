"use server";

import db from "@/lib/prisma";
import { addProduct, addProductType } from "./_type";
import { utapi } from "@/server/uploadthing";

export const getAllProducts = async (
  search: string,
  page: number,
  isActive: boolean = true
) => {
  const pageSize = 10;
  let where = {};
  if (search) {
    where = {
      OR: [{ name: { contains: search } }, { barcode: { contains: search } }],
    };
  }
  // Fetch products
  const products = await db.products.findMany({
    where: {
      is_active: isActive,
      ...where,
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: { id: "desc" },
  });
  // Get the total count of products matching the search criteria
  const totalCount = await db.products.count({
    where,
  });
  // Calculate the total pages
  const totalPages = Math.ceil(totalCount / pageSize);
  // Return products along with total pages
  return {
    products,
    totalPages,
  };
};

export const addProducts = async (values: addProductType, path: string) => {
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
      data: { ...parasedData.data, image: path, quantity: 0 },
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
    const existingProduct = await db.products.findUnique({
      where: { id },
    });

    await db.products.update({
      data: {
        ...parasedData.data,
        image: parasedData.data.image || existingProduct?.image || null,
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

    if (product.quantity !== 0) {
      return {
        message: "ببورە، ئەم کاڵایە کڕدراوە و حەدەدی ماوە",
        success: false,
      };
    }

    const url = product.image as string;
    if (url) {
      const key = url.split("/").pop();
      await deleteIamge(key as string);
    }

    await db.products.update({
      where: { id },
      data: {
        is_active: !product.is_active,
      },
    });

    return {
      message: "بە سەرکەوتویی جێبەجێ کرا",
      success: true,
    };
  } catch (error: any) {
    console.log(error.message);
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
