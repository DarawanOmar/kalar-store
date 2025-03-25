import db from "@/lib/prisma";

export const getTotalRevenue = async (startDate?: Date, endDate?: Date) => {
  try {
    // Define filters for date range
    const dateFilter =
      startDate && endDate
        ? { createdAt: { gte: startDate, lte: endDate } }
        : {};

    // Fetch all relevant data in parallel
    const [
      saleItems,
      saleInvoices,
      purchaseItems,
      expenses,
      subCash,
      mainCash,
    ] = await Promise.all([
      db.sale_invoice_items.findMany({
        include: { Products: true },
        where: dateFilter,
      }),
      db.sale_invoice.findMany({
        where: {
          is_done: true,
          is_discount: true,
          ...dateFilter,
        },
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

    // Helper function to calculate the total purchase price
    const calculateTotalSalePrice = () =>
      saleItems.reduce((total, item) => {
        const productPrice = item.Products?.sale_price || 0;
        return total + productPrice * item.quantity;
      }, 0);
    // Helper function to calculate the total purchase price
    const calculateTotalPurchasePrice = () =>
      purchaseItems.reduce((total, item) => {
        const productPrice = item.Products?.purchase_price || 0;
        return total + productPrice * item.quantity;
      }, 0);
    const calculateTotalDicount = () =>
      saleInvoices.reduce((total, item) => {
        const productPrice = item.discount || 0;
        return total + productPrice;
      }, 0);
    const calculateTotalExpenses = () =>
      expenses.reduce((total, item) => {
        const productPrice = item.price || 0;
        return total + productPrice * item.quantity;
      }, 0);
    // Calculate values
    const totalSalePrice = calculateTotalSalePrice();
    const totalPurchasePrice = calculateTotalPurchasePrice();
    const totalDiscount = calculateTotalDicount();
    const totalExpenses = calculateTotalExpenses();
    const totalRevenue = totalSalePrice - totalPurchasePrice;
    const totalRevenueWithDiscount = totalRevenue - totalDiscount;
    // Return calculated results
    return {
      totalRevenue,
      totalSalePrice,
      totalPurchasePrice,
      totalRevenueWithDiscount,
      totalExpenses,
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
  count?: string;
  description: string;
  isCash?: boolean;
  isMain?: boolean;
}

export interface Invoice {
  id: number;
  name: string;
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
  subCashData?: CashType;
  mainCashData?: CashType;
}

export interface CashType {
  value: number;
  last_amount: number;
  type: "deposit" | "withdraw";
}
