"use server";
import bcrypt from "bcrypt";
import db from "@/lib/prisma";
import { addUser, addUserType } from "./_type";
import { promises as fs } from "fs";

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

export const addUserAction = async (values: addUserType) => {
  try {
    const parasedData = addUser.safeParse(values);
    if (parasedData.success === false) {
      const errors = Object.entries(
        parasedData.error.flatten().fieldErrors
      ).map(([field, error]) => `${field}: ${error}`);
      return {
        message: errors.join(", "),
        success: false,
      };
    }
    const hashPassword = await bcrypt.hash(
      parasedData.data.password as string,
      12
    );
    const { password, ...restSend } = parasedData.data;
    await db.users.create({
      data: {
        ...restSend,
        password: hashPassword,
      },
    });
    return {
      message: "بە سەرکەوتویی زیاد کرا",
      success: true,
    };
  } catch (error) {
    console.dir(error, { depth: null });
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const updateUser = async (id: number, data: addUserType) => {
  try {
    const parasedData = addUser.safeParse(data);
    if (parasedData.success === false) {
      const errors = Object.entries(
        parasedData.error.flatten().fieldErrors
      ).map(([field, error]) => `${field}: ${error}`);
      return {
        message: errors.join(", "),
        success: false,
      };
    }

    const hashPassword = await bcrypt.hash(data.password as string, 12);
    const { password, ...restSend } = parasedData.data;

    await db.users.update({
      data: {
        ...restSend,
        password: hashPassword,
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
