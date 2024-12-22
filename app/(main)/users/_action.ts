"use server";

import db from "@/lib/prisma";
import { addUser, addUserType } from "./_type";

export const getAllUsers = async (search: string, page: number) => {
  try {
    const res = await db.users.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: {
        createdAt: "desc",
      },
    });
    const pageSize = 10;
    const data = {
      data: res,
      totalPage: Math.ceil((await db.users.count()) / pageSize),
    };
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const addUserAction = async (data: addUserType) => {
  try {
    const parasedData = addUser.safeParse(data);
    if (parasedData.success === false) {
      return {
        message: parasedData.error.flatten().fieldErrors["email"],
        success: false,
      };
    }

    await db.users.create({
      data: {
        ...parasedData.data,
        password: parasedData.data.password as string,
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

export const updateUser = async (id: number, data: addUserType) => {
  try {
    await db.users.update({
      data,
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

export const deleteUser = async (id: number) => {
  try {
    await db.users.delete({
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
