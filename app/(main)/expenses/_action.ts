"use server";

import db from "@/lib/prisma";
import { addExpensesType } from "./_type";

export const getAllExpenses = async (search: string, page: number) => {
  try {
    let where = {};
    if (search) {
      where = {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            note: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };
    }
    const res = await db.expenses.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: (page - 1) * 10,
    });
    const pageSize = 10;
    const data = {
      data: res.map((item) => {
        return {
          ...item,
          total: (item.price || 0) * (item.quantity || 0),
        };
      }),
      totalPage: Math.ceil((await db.expenses.count()) / pageSize),
      totalAmount: res.reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
        0
      ),
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

export const addExpensesAction = async (data: addExpensesType) => {
  try {
    await db.expenses.create({
      data,
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

export const updateExpenses = async (id: number, data: addExpensesType) => {
  try {
    await db.expenses.update({
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

export const deleteExpenses = async (id: number) => {
  try {
    await db.expenses.delete({
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
