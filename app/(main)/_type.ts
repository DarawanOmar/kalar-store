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
