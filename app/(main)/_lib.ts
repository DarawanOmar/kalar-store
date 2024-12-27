import db from "@/lib/prisma";

export const getTotalRevenue = async (
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalRevenue: number;
  totalSalePrice: number;
  totalPurchasePrice: number;
}> => {
  try {
    // Define filters for date range
    const dateFilter =
      startDate && endDate
        ? { createdAt: { gte: startDate, lte: endDate } }
        : {};

    // Fetch all relevant data in parallel
    const [saleItems, saleInvoices, purchaseItems] = await Promise.all([
      db.sale_invoice_items.findMany({
        include: { Products: true },
        where: dateFilter,
      }),
      db.sale_invoice.findMany({
        where: {
          is_done: true,
          ...dateFilter,
        },
      }),
      db.purchase_invoice_items.findMany({
        include: { Products: true },
        where: dateFilter,
      }),
    ]);

    // Map discounts to their respective sale invoices for quick lookup
    const invoiceDiscounts = new Map(
      saleInvoices.map((invoice) => [invoice.id, invoice.discount || 0])
    );

    // Helper function to calculate the total sale price
    const calculateTotalSalePrice = () =>
      saleItems.reduce((total, item) => {
        const productPrice = item.Products?.sale_price || 0;
        const discount = invoiceDiscounts.get(item.sale_invoiceId || 0) || 0;
        return total + productPrice * item.quantity - discount;
      }, 0);

    // Helper function to calculate the total purchase price
    const calculateTotalPurchasePrice = () =>
      purchaseItems.reduce((total, item) => {
        const productPrice = item.Products?.purchase_price || 0;
        return total + productPrice * item.quantity;
      }, 0);

    // Calculate values
    const totalSalePrice = calculateTotalSalePrice();
    const totalPurchasePrice = calculateTotalPurchasePrice();
    const totalRevenue = totalSalePrice - totalPurchasePrice;

    // Return calculated results
    return { totalRevenue, totalSalePrice, totalPurchasePrice };
  } catch (error) {
    throw new Error("Could not calculate revenue. Please try again later.");
  }
};
