"use server";

import db from "@/lib/prisma";

export const getAllProducts = async () => {
  const produts = await db.products.findMany();
  return produts;
};

export const deleteUser = async (
  id: string
): Promise<{
  message: string;
  success: boolean;
}> => {
  try {
    // await db.products.delete({ where: { id } });
    return { message: "Product Deleted", success: true };
  } catch (error) {
    return { message: "Error", success: false };
  }
};
