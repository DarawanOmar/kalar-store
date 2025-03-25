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
    const pageSize = 30;
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
export const getHistoryMainCash = async () => {
  try {
    const cashData = await db.historyMainCash.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    const user = await db.users.findUnique({
      where: {
        email: cashData?.[0].user_email,
      },
      select: {
        name: true,
      },
    });
    const dataSend = cashData.map((item) => {
      return {
        ...item,
        user: user?.name,
      };
    });
    return {
      message: "بە سەرکەوتویی گەڕایەوە",
      success: true,
      data: dataSend,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
export const getHistorySubCash = async () => {
  try {
    const cashData = await db.historySubCash.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    const user = await db.users.findUnique({
      where: {
        email: cashData?.[0]?.user_email,
      },
      select: {
        name: true,
      },
    });
    const dataSend = cashData.map((item) => {
      return {
        ...item,
        user: user?.name,
      };
    });

    return {
      message: "بە سەرکەوتویی گەڕایەوە",
      success: true,
      data: dataSend,
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
        name:
          values.type_action === "deposit"
            ? `زیادکردنی پارە بۆ قاسە`
            : `کەمکردنی  پارە لە قاسە`,
        amount: values.amount,
        type_action: values.type_action as ActionType,
        added_by: "person",
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
    await db.subCash.update({
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
    await db.historySubCash.create({
      data: {
        user_email: email,
        name:
          values.type_action === "deposit"
            ? `زیادکردنی پارە بۆ قاسە`
            : `کەمکردنی  پارە لە قاسە`,
        amount: values.amount,
        type_action: values.type_action as ActionType,
        added_by: "person",
      },
    });
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
