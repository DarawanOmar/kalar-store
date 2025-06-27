import React, { Suspense } from "react";
import { CardData, DashboardData } from "../_type";
import { getTimeDescription, parseDateRange } from "@/lib/utils";
import { DatePickerWithRange } from "@/components/layout/date-picker-with-range";
import { Activity, CreditCard, DollarSign, Edit } from "lucide-react";
import BackupButton from "@/components/backup-button";
import { getTotalRevenue } from "./_action";
import { StatCard } from "../feed-dashboard";
import SkeletonDashboard from "@/components/skeleton-dashboard";

type Props = {
  searchParams: searchParamsType;
};

function ReportPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<SkeletonDashboard isReportPage />}>
      <FeedPage searchParams={searchParams} />
    </Suspense>
  );
}

export default ReportPage;

const FeedPage = async ({ searchParams }: Props) => {
  const range = ((await searchParams).range as string) || "";
  const { startDate, endDate } = parseDateRange(range);
  const totals = await getTotalRevenue(startDate, endDate);
  return (
    <div className="flex flex-1 flex-col gap-4 mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 ms-auto w-full lg:max-w-3xl ">
        <DatePickerWithRange
          className="w-full max-w-full xl:col-span-2"
          triggerClassName="w-full max-w-full xl:col-span-2"
        />
        <BackupButton />
        <BackupButton isLocal />
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        {DASHBOARD_CARDS(totals, startDate).map((card, index) => (
          <StatCard key={index} data={card} />
        ))}
      </div>
    </div>
  );
};

export const DASHBOARD_CARDS = (
  totals: DashboardData,
  startDate: Date
): CardData[] => [
  {
    isMain: true,
    isCash: true,
    title: "قاسەی سەرەکی",
    icon: DollarSign,
    count: totals?.mainCashData?.value || 0,
    description: `کۆتا جار ${
      totals.mainCashData?.last_amount?.toLocaleString() || 0
    } ${typeAction(totals.mainCashData?.type || "deposit")}`,
    type: totals.mainCashData?.type as "deposit" | "withdraw",
  },
  {
    isMain: false,
    isCash: true,
    title: "قاسەی لاوەکی",
    icon: Edit,
    count: totals?.subCashData?.value || 0,
    description: `کۆتا جار ${
      totals.subCashData?.last_amount?.toLocaleString() || 0
    } ${typeAction(totals.subCashData?.type || "deposit")}`,
    type: totals.subCashData?.type as "deposit" | "withdraw",
  },
  {
    isMain: false,
    isCash: false,
    title: "کۆی فرۆشراوەکان",
    icon: CreditCard,
    count: totals?.totalSalePrice || 0,
    description: getTimeDescription(startDate),
    type: "none",
  },
  {
    isMain: false,
    isCash: false,
    title: "کۆی کڕدراوەکان",
    icon: Activity,
    count: totals?.totalPurchasePrice || 0,
    description: getTimeDescription(startDate),
    type: "none",
  },
  {
    isMain: false,
    isCash: false,
    title: "کۆی فرۆشتن بە قەزر",
    icon: Activity,
    count: totals?.totalLoanSales || 0,
    description: getTimeDescription(startDate),
    type: "none",
  },
  {
    isMain: false,
    isCash: false,
    title: "کۆی فرۆشتن بە کاش",
    icon: Activity,
    count: totals?.totalCashSales || 0,
    description: getTimeDescription(startDate),
    type: "none",
  },
  {
    isMain: false,
    isCash: false,
    title: "کۆی قەرزی دراوە",
    icon: Activity,
    count: totals?.totalPaidLoan || 0,
    description: getTimeDescription(startDate),
    type: "none",
  },
  {
    isMain: false,
    isCash: false,
    title: "کۆی قەرزی ماوە",
    icon: Activity,
    count: totals?.totalRemainingLoan || 0,
    description: getTimeDescription(startDate),
    type: "none",
  },
  {
    isMain: false,
    isCash: false,
    title: "کۆی خەرجی",
    icon: Activity,
    count: totals?.totalExpenses || 0,
    description: getTimeDescription(startDate),
    type: "none",
  },
];

export function typeAction(value: "deposit" | "withdraw") {
  return value === "deposit" ? "زیادکراوە" : "کەمکراوە";
}
