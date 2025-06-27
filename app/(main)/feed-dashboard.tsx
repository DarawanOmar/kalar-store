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
import { Activity, ArrowUpRight, CreditCard, Percent } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CardData, DashboardData, Invoice } from "./_type";
import { getTotalRevenue, TodayPurchase, TodaySale } from "./_action";
import ModalAddCash from "@/components/modal-add-cash";

export default async function FeedDashboard() {
  const [totals, completeSaleInvoices, completeInvoices] = await Promise.all([
    getTotalRevenue(),
    TodaySale(),
    TodayPurchase(),
  ]);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <div className="flex flex-1 flex-col gap-4 mt-5">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
        {DASHBOARD_CARDS(totals).map((card, index) => (
          <StatCard key={index} data={card} />
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 2xl:grid-cols-2">
        <Card className="2xl:col-span-1 max-h-max">
          <CardHeader className="flex flex-col gap-5 sm:flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>کڕینەکان</CardTitle>
              <CardDescription>کڕینەکان لە ماوەی ڕابردوو</CardDescription>
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
                {!completeInvoices.data?.data?.length ? (
                  <EmptyState message="هیچ کڕینێک تۆمار نەکراوە" />
                ) : (
                  completeInvoices.data?.data?.map((invoice, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>{invoice.name}</div>
                      </TableCell>
                      <TableCell>{format(invoice.createdAt, "P")}</TableCell>
                      <TableCell>{invoice.total.toLocaleString()}-</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="max-h-max">
          <CardHeader className="flex flex-col gap-5 sm:flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>فرۆشتن لەم دواییانەدا</CardTitle>
              <CardDescription>فرۆشتنەکان لە ماوەی ڕابردوو</CardDescription>
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

export const DASHBOARD_CARDS = (totals: DashboardData): CardData[] => [
  {
    isMain: false,
    isCash: false,
    title: "کۆی فرۆشراوەکانی ئەمڕۆ",
    icon: CreditCard,
    count: totals?.totalSalePrice || 0,
    description: "",
    type: "none",
  },
  {
    isMain: false,
    isCash: false,
    title: "کۆی کڕدراوەکانی ئەمڕۆ",
    icon: Activity,
    count: totals?.totalPurchasePrice || 0,
    description: "",
    type: "none",
  },

  {
    isMain: false,
    isCash: false,
    title: "کۆی خەرجییەکانی ئەمڕۆ",
    icon: Activity,
    count: totals?.totalExpenses || 0,
    description: "",
    type: "none",
  },
];

// Memoized components for better performance
export const StatCard = memo(
  ({ data, className }: { className?: string; data: CardData }) => (
    <Card
      className={cn(
        "hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-muted",
        className
      )}
    >
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
            <div
              className={cn("flex gap-1 items-center text-2xl font-bold", {
                "text-red-400": data.count < 0,
              })}
            >
              <span className="text-xl">IQD </span>
              <span className={cn("")}>
                {data.count?.toLocaleString() || 0}
              </span>
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
              <span>{data.count?.toLocaleString() || 0}</span>
            </div>
            <p className={cn("text-xs text-muted-foreground")}>
              {data.description}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
);

const SaleItem = memo(({ sale }: { sale: Invoice }) => (
  <div className="flex items-center gap-4 ">
    <Avatar className="hidden h-9 w-9 sm:flex">
      <AvatarImage src="/empty-product.jpg" alt="Avatar" />
      <AvatarFallback />
    </Avatar>
    <div className="grid gap-1">
      <p className="text-sm font-medium leading-none">{sale.name}</p>
      <p className="text-sm text-muted-foreground">{sale.place}</p>
    </div>
    <div className="flex flex-col ms-auto font-medium">
      <div className="flex items-center gap-1">
        <Badge className="font-normal">
          {sale.type === "loan" ? "قەرز" : "کاش"}
        </Badge>
        <span>{sale.total.toLocaleString()}+</span>
      </div>
      {sale.discount ? (
        <div className="flex items-center">
          <span className="text-xs">{sale.discount.toLocaleString()}</span>
          <Percent size={12} />
        </div>
      ) : null}
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
