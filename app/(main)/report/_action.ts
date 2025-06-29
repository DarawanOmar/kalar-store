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

// Function for Bar Chart Data - Monthly/Weekly Revenue Comparison
export const getBarChartData = async (startDate?: Date, endDate?: Date) => {
  try {
    const dateFilter =
      startDate && endDate
        ? { createdAt: { gte: startDate, lte: endDate } }
        : {};

    // Get sales data grouped by month
    const salesData = await db.sale_invoice.findMany({
      where: { ...dateFilter },
      select: {
        total_amount: true,
        type: true,
        createdAt: true,
      },
    });

    // Get purchase data grouped by month
    const purchaseData = await db.purchase_invoice_items.findMany({
      where: dateFilter,
      select: {
        unit_price: true,
        quantity: true,
        createdAt: true,
      },
    });

    // Get expenses data grouped by month
    const expensesData = await db.expenses.findMany({
      where: dateFilter,
      select: {
        price: true,
        quantity: true,
        createdAt: true,
      },
    });

    // Group data by month
    const monthlyData = new Map();

    // Process sales
    salesData.forEach((sale) => {
      const monthKey = sale.createdAt.toISOString().substring(0, 7); // YYYY-MM format
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthKey,
          sales: 0,
          purchases: 0,
          expenses: 0,
          cashSales: 0,
          loanSales: 0,
          fill: "#6E2D2A", // amber
        });
      }
      const data = monthlyData.get(monthKey);
      data.sales += sale.total_amount || 0;
      if (sale.type === "cash") {
        data.cashSales += sale.total_amount || 0;
      } else {
        data.loanSales += sale.total_amount || 0;
      }
    });

    // Process purchases
    purchaseData.forEach((purchase) => {
      const monthKey = purchase.createdAt.toISOString().substring(0, 7);
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthKey,
          sales: 0,
          purchases: 0,
          expenses: 0,
          cashSales: 0,
          loanSales: 0,
          fill: "#6E2D2A", // amber
        });
      }
      const data = monthlyData.get(monthKey);
      data.purchases += (purchase.unit_price || 0) * purchase.quantity;
    });

    // Process expenses
    expensesData.forEach((expense) => {
      const monthKey = expense.createdAt.toISOString().substring(0, 7);
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthKey,
          sales: 0,
          purchases: 0,
          expenses: 0,
          cashSales: 0,
          loanSales: 0,
          fill: "#6E2D2A", // amber
        });
      }
      const data = monthlyData.get(monthKey);
      data.expenses += (expense.price || 0) * expense.quantity;
    });

    // Convert to array and sort by month
    const chartData = Array.from(monthlyData.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((item) => ({
        ...item,
        profit: item.sales - item.purchases - item.expenses,
        monthName: new Date(item.month + "-01").toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      }));

    return chartData;
  } catch (error) {
    throw new Error("Could not fetch bar chart data. Please try again later.");
  }
};

// Function for Pie Chart Data - Revenue Distribution
export const getPieChartData = async (startDate?: Date, endDate?: Date) => {
  try {
    const dateFilter =
      startDate && endDate
        ? { createdAt: { gte: startDate, lte: endDate } }
        : {};

    const [
      cashSalesTotal,
      loanSalesTotal,
      purchaseTotal,
      expensesTotal,
      topProducts,
    ] = await Promise.all([
      // Cash Sales
      db.sale_invoice.aggregate({
        _sum: { total_amount: true },
        where: { type: "cash", ...dateFilter },
      }),
      // Loan Sales
      db.sale_invoice.aggregate({
        _sum: { total_amount: true },
        where: { type: "loan", ...dateFilter },
      }),
      // Total Purchases
      db.purchase_invoice_items.aggregate({
        _sum: { unit_price: true },
        where: dateFilter,
      }),
      // Total Expenses
      db.expenses.aggregate({
        _sum: { price: true },
        where: dateFilter,
      }),
      // Top selling products for product distribution
      db.sale_invoice_items.groupBy({
        by: ["product_name"],
        _sum: {
          quantity: true,
          unit_price: true,
        },
        where: dateFilter,
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 5,
      }),
    ]);

    // Revenue Distribution Pie Chart Data
    const revenueDistribution = [
      {
        name: "Cash Sales",
        value: cashSalesTotal._sum.total_amount || 0,
        fill: "#422006", // green
      },
      {
        name: "Loan Sales",
        value: loanSalesTotal._sum.total_amount || 0,
        fill: "#022c22", // blue
      },
    ].filter((item) => item.value > 0);

    // Expense vs Revenue Pie Chart Data
    const expenseVsRevenue = [
      {
        name: "Total Sales",
        value:
          (cashSalesTotal._sum.total_amount || 0) +
          (loanSalesTotal._sum.total_amount || 0),
        fill: "#059669", // green
      },
      {
        name: "Purchases",
        value: purchaseTotal._sum.unit_price || 0,
        fill: "#4338ca", // blue
      },
      {
        name: "Expenses",
        value: expensesTotal._sum.price || 0,
        fill: "#ef4444", // red
      },
    ].filter((item) => item.value > 0);

    // Top Products Distribution
    const productDistribution = topProducts.map((product, index) => ({
      name: product.product_name,
      value: product._sum.quantity || 0,
      revenue: (product._sum.unit_price || 0) * (product._sum.quantity || 0),
      fill:
        [
          "#8b5cf6", // violet
          "#06b6d4", // cyan
          "#84cc16", // lime
          "#f97316", // orange
          "#ec4899", // pink
        ][index] || "#6b7280", // gray fallback
    }));

    // Payment Status Distribution
    const [paidLoans, remainingLoans] = await Promise.all([
      db.sale_invoice.aggregate({
        _sum: { paid_amount: true },
        where: { type: "loan", ...dateFilter },
      }),
      db.sale_invoice.aggregate({
        _sum: { remaining_amount: true },
        where: { type: "loan", ...dateFilter },
      }),
    ]);

    const paymentStatusDistribution = [
      {
        name: "Paid Amount",
        value: paidLoans._sum.paid_amount || 0,
        color: "#22c55e", // green
      },
      {
        name: "Remaining Amount",
        value: remainingLoans._sum.remaining_amount || 0,
        color: "#ef4444", // red
      },
    ].filter((item) => item.value > 0);

    return {
      revenueDistribution,
      expenseVsRevenue,
      productDistribution,
      paymentStatusDistribution,
      summary: {
        totalRevenue:
          (cashSalesTotal._sum.total_amount || 0) +
          (loanSalesTotal._sum.total_amount || 0),
        totalPurchases: purchaseTotal._sum.unit_price || 0,
        totalExpenses: expensesTotal._sum.price || 0,
        netProfit:
          (cashSalesTotal._sum.total_amount || 0) +
          (loanSalesTotal._sum.total_amount || 0) -
          (purchaseTotal._sum.unit_price || 0) -
          (expensesTotal._sum.price || 0),
      },
    };
  } catch (error) {
    throw new Error("Could not fetch pie chart data. Please try again later.");
  }
};

// Additional function for Daily Sales Trend (for line charts if needed)
export const getDailySalesTrend = async (startDate?: Date, endDate?: Date) => {
  try {
    const dateFilter =
      startDate && endDate
        ? { createdAt: { gte: startDate, lte: endDate } }
        : {};

    const salesData = await db.sale_invoice.findMany({
      where: { ...dateFilter },
      select: {
        total_amount: true,
        type: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group by day
    const dailyData = new Map();

    salesData.forEach((sale) => {
      const dayKey = sale.createdAt.toISOString().substring(0, 10); // YYYY-MM-DD format
      if (!dailyData.has(dayKey)) {
        dailyData.set(dayKey, {
          date: dayKey,
          totalSales: 0,
          cashSales: 0,
          loanSales: 0,
          count: 0,
        });
      }
      const data = dailyData.get(dayKey);
      data.totalSales += sale.total_amount || 0;
      data.count += 1;
      if (sale.type === "cash") {
        data.cashSales += sale.total_amount || 0;
      } else {
        data.loanSales += sale.total_amount || 0;
      }
    });

    return Array.from(dailyData.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((item) => ({
        ...item,
        dateFormatted: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
  } catch (error) {
    throw new Error(
      "Could not fetch daily sales trend. Please try again later."
    );
  }
};
