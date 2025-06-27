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
