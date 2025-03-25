"use server";

import db from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { payLoanType } from "./_type";

// ----------------------GET------------------------------
export const getAllLoans = async (search: string, page: number) => {
  try {
    let where: Prisma.Sale_invoiceWhereInput | undefined = {};
    if (search) {
      where = {
        type: "loan",
        is_done: true,
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
    const res = await db.sale_invoice.findMany({
      where: {
        type: "loan",
        is_done: true,
        remaining_amount: {
          gt: 0,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: (page - 1) * 10,
    });
    const pageSize = 10;
    const total_amount = res.reduce(
      (acc, item) => acc + (item.total_amount || 0),
      0
    );
    const data = {
      data: res,
      totalAmount: total_amount,
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
