"use server";

import db from "@/lib/prisma";
import { addCashType, addExpensesType } from "./_type";
import { ActionType } from "@prisma/client";
import { getSession } from "@/lib/utils/cookies";

// ----------------------GET-------------------------
export const getAllExpenses = async (search: string, page: number) => {
  try {
    let where = {};
    if (search) {
      where = {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            note: {
              contains: search,
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
export const getMainCash = async () => {
  try {
    const staticCash = await db.mainCash.findFirst();
    return {
      message: "بە سەرکەوتویی گەڕایەوە",
      success: true,
      data: staticCash,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
export const getSubCash = async () => {
  try {
    const staticCash = await db.subCash.findFirst();
    return {
      message: "بە سەرکەوتویی گەڕایەوە",
      success: true,
      data: staticCash,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

// ----------------------PUT-------------------------

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

// ----------------------POST-------------------------

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
export const addMainCashAction = async (values: addCashType) => {
  try {
    const user = await getSession();
    if (!user) {
      return {
        message: "تکایە تۆکەنەکە دووبارە بکەوە",
        success: false,
      };
    }
    const email = user.token.split(",between,")[1];
    await db.mainCash.update({
      data: {
        amount: {
          [values.type_action === "deposit" ? "increment" : "decrement"]:
            values.amount,
        },
        last_amount: values.amount,
        type_action: values.type_action as ActionType,
      },
      where: {
        id: 1,
      },
    });
    await db.historyMainCash.create({
      data: {
        user_email: email,
        name: `History-${values.type_action}`,
        amount: values.amount,
        type_action: values.type_action as ActionType,
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
export const addSubCashAction = async (values: addCashType) => {
  try {
    const user = await getSession();
    if (!user) {
      return {
        message: "تکایە تۆکەنەکە دووبارە بکەوە",
        success: false,
      };
    }

    const email = user.token.split(",between,")[1];

    await db.$transaction([
      db.subCash.update({
        data: {
          amount: {
            [values.type_action === "deposit" ? "increment" : "decrement"]:
              values.amount,
          },
          last_amount: values.amount,
          type_action: values.type_action,
        },
        where: {
          id: 1,
        },
      }),
      db.historySubCash.create({
        data: {
          amount: values.amount,
          name: `History-${values.type_action}`,
          type_action: values.type_action as ActionType,
          user_email: email,
        },
      }),
    ]);

    return {
      message: "بە سەرکەوتویی زیاد کرا",
      success: true,
    };
  } catch (error) {
    console.error("Error in addSubCashAction:", error);
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

// ----------------------DELETE-------------------------
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
