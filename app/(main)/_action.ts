"use server";
import db from "@/lib/prisma";

export const getTotalRevenue = async (startDate?: Date, endDate?: Date) => {
  try {
    const dateFilter =
      startDate && endDate
        ? { createdAt: { gte: startDate, lte: endDate } }
        : {};

    const [
      cashSalesTotal,
      loanSalesTotal,
      totalSale,
      purchaseItems,
      expenses,
      subCash,
      mainCash,
    ] = await Promise.all([
      db.sale_invoice.aggregate({
        _sum: { total_amount: true },
        where: { type: "cash", ...dateFilter },
      }),
      db.sale_invoice.aggregate({
        _sum: { total_amount: true, remaining_amount: true, paid_amount: true },
        where: { type: "loan", ...dateFilter },
      }),
      db.sale_invoice.aggregate({
        _sum: { total_amount: true },
        where: { ...dateFilter },
      }),
      db.purchase_invoice_items.findMany({
        include: { Products: true },
        where: dateFilter,
      }),
      db.expenses.findMany({
        where: dateFilter,
      }),
      db.subCash.findFirst(),
      db.mainCash.findFirst(),
    ]);

    const calculateTotalPurchasePrice = () =>
      purchaseItems.reduce((total, item) => {
        const productPrice = item.Products?.purchase_price || 0;
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
      totalCashSales: cashSalesTotal._sum.total_amount || 0,
      totalLoanSales: loanSalesTotal._sum.total_amount || 0,
      totalPaidLoan: loanSalesTotal._sum.paid_amount || 0, // ✅ Total Paid Loan Amount
      totalRemainingLoan: loanSalesTotal._sum.remaining_amount || 0,
      subCashData: {
        value: subCash?.amount || 0,
        last_amount: subCash?.last_amount || 0,
        type: subCash?.type_action || "deposit",
      },
      mainCashData: {
        value: mainCash?.amount || 0,
        last_amount: mainCash?.last_amount || 0,
        type: mainCash?.type_action || "deposit",
      },
    };
  } catch (error) {
    throw new Error("Could not calculate revenue. Please try again later.");
  }
};

// Types for better type safety
export interface CardData {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  description: string;
  isCash?: boolean;
  isMain?: boolean;
  type: "deposit" | "withdraw" | "none";
}

export interface Invoice {
  id: number;
  name: string;
  type: string;
  invoice_number: string;
  is_discount: boolean;
  place: string;
  createdAt: Date;
  discount: number | null | undefined;
  total: number;
}

export interface DashboardData {
  totalRevenueWithDiscount?: number;
  totalSalePrice?: number;
  totalPurchasePrice?: number;
  totalExpenses?: number;
  totalLoanSales?: number;
  totalCashSales?: number;
  totalRemainingLoan?: number;
  totalPaidLoan?: number;
  subCashData?: CashType;
  mainCashData?: CashType;
}

export interface CashType {
  value: number;
  last_amount: number;
  type: "deposit" | "withdraw";
}
