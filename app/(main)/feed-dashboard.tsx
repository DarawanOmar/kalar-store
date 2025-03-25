import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Edit,
  Percent,
} from "lucide-react";
import Link from "next/link";
import { getAllCompleteSaleInvoice } from "./sale-invoice/_lib";
import { getAllCompleteInvoice } from "./purchase-invoice/_lib";
import { format } from "date-fns";
import { CardData, DashboardData, getTotalRevenue, Invoice } from "./_action";
import ModalAddCash from "@/components/modal-add-cash";
import { cn, getTimeDescription, parseDateRange } from "@/lib/utils";
import { DatePickerWithRange } from "@/components/layout/date-picker-with-range";

type Props = {
  searchParams: searchParamsType;
};

export default async function FeedDashboard({ searchParams }: Props) {
  const range = ((await searchParams).range as string) || ""; //range=03-03-2025to03-25-2025
  const { startDate, endDate } = parseDateRange(range);

  const [totals, completeSaleInvoices, completeInvoices] = await Promise.all([
    getTotalRevenue(startDate, endDate),
    getAllCompleteSaleInvoice(startDate, endDate, 1),
    getAllCompleteInvoice(startDate, endDate, 1),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 mt-5">
      <div className="ms-auto">
        <DatePickerWithRange />
      </div>{" "}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
        {DASHBOARD_CARDS(totals, startDate).map((card, index) => (
          <StatCard key={index} data={card} />
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 2xl:grid-cols-2">
        <Card className="2xl:col-span-1 max-h-max">
          <CardHeader className="flex flex-col gap-5 sm:flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>کڕینەکان</CardTitle>
              <CardDescription>
                کڕینەکان لە ماوەی هەفتەی ڕابردوو
              </CardDescription>
            </div>
            <Button
              asChild
              size="sm"
              className="ms-auto gap-1 gradient-blue-left"
              variant="gooeyRight"
            >
              <Link href="/purchase-invoice">
                <ArrowUpRight className="h-4 w-4" />
                بینینی هەموویان
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">کڕیار</TableHead>
                  <TableHead className="text-start">بەروار</TableHead>
                  <TableHead className="text-start">کۆی گشتن</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!completeInvoices.data?.formattedInvoices.length ? (
                  <EmptyState message="هیچ کڕینێک تۆمار نەکراوە" />
                ) : (
                  completeInvoices.data?.formattedInvoices.map(
                    (invoice, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>{invoice.name}</div>
                        </TableCell>
                        <TableCell>{format(invoice.createdAt, "P")}</TableCell>
                        <TableCell>{invoice.total.toLocaleString()}-</TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="max-h-max">
          <CardHeader className="flex flex-col gap-5 sm:flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>فرۆشتن لەم دواییانەدا</CardTitle>
              <CardDescription>
                فرۆشتنەکان لە ماوەی هەفتەی ڕابردوو
              </CardDescription>
            </div>
            <Button
              asChild
              size="sm"
              className="ms-auto gap-1 gradient-blue-left"
              variant="gooeyRight"
            >
              <Link href="/sale-invoice">
                <ArrowUpRight className="h-4 w-4" />
                بینینی هەموویان
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-8">
            {!completeSaleInvoices?.data?.data?.length ? (
              <div className="text-center my-[77px] text-primary">
                هیچ فرۆشتنێک تۆمار نەکراوە
              </div>
            ) : (
              completeSaleInvoices?.data?.data?.map((sale, index) => (
                <SaleItem key={index} sale={sale} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dashboard cards data
const DASHBOARD_CARDS = (
  totals: DashboardData,
  startDate: Date
): CardData[] => [
  {
    isMain: true,
    isCash: true,
    title: "قاسەی سەرەکی",
    icon: DollarSign,
    count: totals?.mainCashData?.value?.toLocaleString(),
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
    count: totals?.subCashData?.value?.toLocaleString(),
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
    count: totals?.totalSalePrice?.toLocaleString(),
    description: getTimeDescription(startDate),
    type: "none",
  },
  {
    isMain: false,
    isCash: false,
    title: "کۆی کڕدراوەکان",
    icon: Activity,
    count: totals?.totalPurchasePrice?.toLocaleString(),
    description: getTimeDescription(startDate),
    type: "none",
  },
  {
    isMain: false,
    isCash: false,
    title: "کۆی خەرجی",
    icon: Activity,
    count: totals?.totalExpenses?.toLocaleString(),
    description: getTimeDescription(startDate),
    type: "none",
  },
];

// Memoized components for better performance
const StatCard = memo(({ data }: { data: CardData }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
      {data.isCash ? (
        data.isMain ? (
          <ModalAddCash isMain={true} />
        ) : (
          <ModalAddCash isMain={false} />
        )
      ) : (
        <data.icon className="h-4 w-4 text-muted-foreground" />
      )}{" "}
    </CardHeader>
    <CardContent>
      {data.isCash ? (
        <Link
          href={
            data.isMain
              ? "/history-transaction?type=main-cash"
              : "/history-transaction"
          }
        >
          <div className="flex gap-1 items-center text-2xl font-bold">
            <span className="text-xl">IQD </span>
            <span>{data.count}</span>
          </div>
          <p
            className={cn("text-xs text-muted-foreground", {
              "text-green-500": data.type === "deposit",
              "text-red-500": data.type === "withdraw",
            })}
          >
            {data.description}
          </p>
        </Link>
      ) : (
        <>
          <div className="flex gap-1 items-center text-2xl font-bold">
            <span className="text-xl">IQD </span>
            <span>{data.count}</span>
          </div>
          <p className={cn("text-xs text-muted-foreground")}>
            {data.description}
          </p>
        </>
      )}
    </CardContent>
  </Card>
));

const SaleItem = memo(({ sale }: { sale: Invoice }) => (
  <div className="flex items-center gap-4">
    <Avatar className="hidden h-9 w-9 sm:flex">
      <AvatarImage src="/empty-product.jpg" alt="Avatar" />
      <AvatarFallback />
    </Avatar>
    <div className="grid gap-1">
      <p className="text-sm font-medium leading-none">{sale.name}</p>
      <p className="text-sm text-muted-foreground">{sale.place}</p>
    </div>
    <div className="flex flex-col ms-auto font-medium">
      <span>{sale.total.toLocaleString()}+</span>
      {sale.discount && (
        <div className="flex items-center">
          <span className="text-xs">{sale.discount.toLocaleString()}</span>
          <Percent size={12} />
        </div>
      )}
    </div>
  </div>
));

const EmptyState = memo(({ message }: { message: string }) => (
  <TableRow className="h-32">
    <TableCell colSpan={3} className="text-center text-primary">
      {message}
    </TableCell>
  </TableRow>
));

function typeAction(value: "deposit" | "withdraw") {
  return value === "deposit" ? "زیادکراوە" : "کەمکراوە";
}
