"use server";
import bcrypt from "bcrypt";
import db from "@/lib/prisma";
import { addUser, addUserType } from "./_type";
import { deleteIamge } from "../products/_action";

export const getAllUsers = async (search: string, page: number) => {
  try {
    const res = await db.users.findMany({
      where: {
        name: {
          contains: search,
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
    const existUser = await db.users.findUnique({
      where: { email: parasedData.data.email },
    });
    if (existUser) {
      return {
        message: "ببورە، ئەم بەکارهێنەرە بوونی هەیە",
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
    const existUser = await db.users.findUnique({
      where: { id },
    });
    if (!existUser) {
      return {
        message: "ببورە، ئەم بەکارهێنەرە بوونی نییە",
        success: false,
      };
    }

    let hashPassword;
    if (data.password) {
      hashPassword = await bcrypt.hash(data.password as string, 12);
    }

    let imageValue;
    if (parasedData.data.image) {
      imageValue = parasedData.data.image;
    }
    await db.users.update({
      data: {
        name: parasedData.data.name,
        email: parasedData.data.email,
        password: hashPassword,
        image: imageValue,
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
    const existUser = await db.users.findUnique({
      where: { id },
    });
    if (!existUser) {
      return {
        message: "ببورە، ئەم بەکارهێنەرە بوونی نییە",
        success: false,
      };
    }

    const url = existUser.image as string;
    if (url) {
      const key = url.split("/").pop();
      await deleteIamge(key as string);
    }
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
