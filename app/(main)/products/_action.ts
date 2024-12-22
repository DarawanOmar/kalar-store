"use server";

import db from "@/lib/prisma";
import { addProductType } from "./_type";
import { promises as fs } from "fs";

export const getAllProducts = async () => {
  const produts = await db.products.findMany();
  return produts;
};
export const addProducts = async (values: addProductType) => {
  const { image, ...rest } = values;
  const data = (await image?.arrayBuffer()) as ArrayBuffer;
  const buffer = Buffer.from(data);
  await fs.writeFile(`public/img/${image?.name}`, buffer);

  try {
    await db.products.create({
      data: {
        ...rest,
        image: image?.name,
      },
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
  const { image, ...rest } = values;
  try {
    await db.products.update({
      data: rest,
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
