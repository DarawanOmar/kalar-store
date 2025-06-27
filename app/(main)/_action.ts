"use server";
import db from "@/lib/prisma";
import { handlePrismaError } from "@/lib/utils";

export const getTotalRevenue = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );
    const todayFilter = {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };
    const [totalSale, purchaseItems, expenses] = await Promise.all([
      db.sale_invoice.aggregate({
        _sum: { total_amount: true },
        where: { ...todayFilter },
      }),
      db.purchase_invoice_items.findMany({
        where: { ...todayFilter },
      }),
      db.expenses.findMany({
        where: { ...todayFilter },
      }),
    ]);

    const calculateTotalPurchasePrice = () =>
      purchaseItems.reduce((total, item) => {
        const productPrice = item.unit_price || 0;
        return total + productPrice * item.quantity;
      }, 0);

    const calculateTotalExpenses = () =>
      expenses.reduce((total, item) => {
        const productPrice = item.price || 0;
        return total + productPrice * item.quantity;
      }, 0);

    const totalSalePrice = totalSale._sum.total_amount || 0;
    const totalPurchasePrice = calculateTotalPurchasePrice();
    const totalExpenses = calculateTotalExpenses();

    return {
      totalSalePrice,
      totalPurchasePrice,
      totalExpenses,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const TodaySale = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );
    const todayFilter = {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    const invoices = await db.sale_invoice.findMany({
      where: { ...todayFilter },
      select: {
        name: true,
        invoice_number: true,
        discount: true,
        is_discount: true,
        id: true,
        createdAt: true,
        place: true,
        type: true,
        Sale_invoice_items: {
          select: {
            quantity: true,
            unit_price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedInvoices = invoices.map((invoice) => {
      const total = invoice.Sale_invoice_items.reduce(
        (sum, item) => sum + (item.unit_price || 0) * item.quantity,
        0
      );

      return {
        id: invoice.id,
        name: invoice.name,
        invoice_number: invoice.invoice_number,
        is_discount: invoice.is_discount,
        place: invoice.place,
        createdAt: invoice.createdAt,
        discount: invoice.discount,
        type: invoice.type,
        total,
      };
    });

    return {
      data: {
        data: formattedInvoices,
      },
      success: true,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
export const TodayPurchase = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );
    const todayFilter = {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    const invoices = await db.purchase_invoice.findMany({
      where: { ...todayFilter },
      select: {
        name: true,
        invoice_number: true,
        id: true,
        createdAt: true,
        place: true,
        Purchase_invoice_items: {
          select: {
            quantity: true,
            unit_price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedInvoices = invoices.map((invoice) => {
      const total = invoice.Purchase_invoice_items.reduce(
        (sum, item) => sum + (item.unit_price || 0) * item.quantity,
        0
      );

      return {
        id: invoice.id,
        name: invoice.name,
        invoice_number: invoice.invoice_number,
        place: invoice.place,
        createdAt: invoice.createdAt,
        total,
      };
    });

    return {
      data: {
        data: formattedInvoices,
      },
      success: true,
    };
  } catch (error) {
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
// Types for better type safety
