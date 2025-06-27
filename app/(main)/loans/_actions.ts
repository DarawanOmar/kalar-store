"use server";

import db from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { payLoanType } from "./_type";
import { getSession } from "@/lib/utils/cookies";

// ----------------------GET------------------------------
export const getAllLoans = async (
  search: string,
  page: number,
  startDate?: Date,
  endDate?: Date
) => {
  try {
    const pageSize = 30;
    // Date filter condition
    const dateFilter =
      startDate && endDate
        ? { createdAt: { gte: startDate, lte: endDate } }
        : {};

    // Name search filter
    const nameFilter = search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {};

    const where: Prisma.Sale_invoiceWhereInput = {
      type: "loan",
      is_done: true,
      remaining_amount: { gt: 0 },
      ...dateFilter,
      ...nameFilter,
    };

    // Fetch filtered data
    const res = await db.sale_invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    // Calculate total loan amount
    const totalAmount = res.reduce(
      (acc, item) => acc + (item.total_amount || 0),
      0
    );

    return {
      success: true,
      data: {
        data: res,
        totalAmount,
        totalPage: Math.ceil(
          (await db.sale_invoice.count({ where })) / pageSize
        ),
      },
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const getOneLoanDetails = async (id: number) => {
  if (!id) {
    return {
      message: "ئایدی نیە",
      success: false,
    };
  }
  const getLoan = await db.loanPayment.findMany({
    where: {
      sale_invoiceId: id,
    },
    include: {
      Sale_invoice: {
        select: {
          total_amount: true,
          remaining_amount: true,
        },
      },
    },
  });
  return {
    data: getLoan,
    message: "بە سەرکەوتوی گەڕایەوە",
    success: true,
  };
};

// ----------------------POST------------------------------
export const payLoanAction = async (id: number, data: payLoanType) => {
  try {
    const loan = await db.sale_invoice.findUnique({
      where: {
        id,
        type: "loan",
      },
    });
    if (!loan) {
      return {
        message: "هەڵەیەک هەیە",
        success: false,
      };
    }
    if (loan.remaining_amount < data.amount) {
      return {
        message: "بڕی پارە زیاترە لە پارەی قەرز",
        success: false,
      };
    }
    await db.sale_invoice.update({
      where: {
        id,
      },
      data: {
        paid_amount: loan.paid_amount + data.amount,
        remaining_amount: loan.remaining_amount - data.amount,
        updatedAt: new Date(),
      },
    });
    await db.loanPayment.create({
      data: {
        sale_invoiceId: id,
        amount: data.amount,
        note: data.note,
        paid_at: new Date(),
      },
    });

    await db.mainCash.update({
      where: {
        id: 1,
      },
      data: {
        amount: {
          increment: data.amount,
        },
        last_amount: data.amount,
        type_action: "deposit",
      },
    });
    const user = await getSession();
    if (!user) {
      return {
        message: "تکایە تۆکەنەکە دووبارە بکەوە",
        success: false,
      };
    }
    const email = user.token.split(",between,")[1];
    await db.historyMainCash.create({
      data: {
        amount: data.amount,
        type_action: "deposit",
        added_by: "system",
        name: "دانەوەی پارەی قەرز",
        user_email: email,
      },
    });
    return {
      message: "بە سەرکەوتوی پارەدان کرا",
      success: true,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
