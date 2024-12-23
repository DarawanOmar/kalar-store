"use server";

import db from "@/lib/prisma";
import { addProduct, addProductType } from "./_type";
import { promises as fs } from "fs";
import { UTApi } from "uploadthing/server";
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
    where,
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
      data: { ...parasedData.data },
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
