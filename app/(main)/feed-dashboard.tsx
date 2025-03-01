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
  Percent,
} from "lucide-react";
import Link from "next/link";
import { getAllCompleteSaleInvoice } from "./sale-invoice/_lib";
import { getAllCompleteInvoice } from "./purchase-invoice/_lib";
import { format } from "date-fns";
import { CardData, DashboardData, getTotalRevenue, Invoice } from "./_lib";
import { DatePickerWithRange } from "@/components/layout/date-picker-with-range";

export default async function FeedDashboard() {
  const { now, sevenDaysAgo } = getDateRange();

  const [totals, completeSaleInvoices, completeInvoices] = await Promise.all([
    getTotalRevenue(sevenDaysAgo, now),
    getAllCompleteSaleInvoice(sevenDaysAgo, now, 1),
    getAllCompleteInvoice(sevenDaysAgo, now, 1),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4  md:gap-8 md:p-4">
      <div className="flex justify-between items-center">
        <h1>ڕاپۆرت</h1>
        <DatePickerWithRange />
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
        {DASHBOARD_CARDS(totals).map((card, index) => (
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
            {!completeSaleInvoices.data?.formattedInvoices.length ? (
              <div className="text-center my-[77px] text-primary">
                هیچ فرۆشتنێک تۆمار نەکراوە
              </div>
            ) : (
              completeSaleInvoices.data?.formattedInvoices.map(
                (sale, index) => <SaleItem key={index} sale={sale} />
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Utility function to get date range
const getDateRange = () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  return { now, sevenDaysAgo };
};

// Dashboard cards data
const DASHBOARD_CARDS = (totals: DashboardData): CardData[] => [
  {
    title: "کۆی داهات",
    icon: DollarSign,
    count: totals?.totalRevenueWithDiscount?.toLocaleString(),
    description: " لە هەفتەی ڕابردوو",
  },
  {
    title: "قاسەی دووکان",
    icon: DollarSign,
    count: totals?.totalRevenueWithDiscount?.toLocaleString(),
    description: " لە هەفتەی ڕابردوو",
  },
  {
    title: "قاسەی حیسابات",
    icon: DollarSign,
    count: totals?.totalRevenueWithDiscount?.toLocaleString(),
    description: " لە هەفتەی ڕابردوو",
  },
  {
    title: "کۆی فرۆشراوەکان",
    icon: CreditCard,
    count: totals?.totalSalePrice?.toLocaleString(),
    description: " لە هەفتەی ڕابردوو",
  },
  {
    title: "کۆی کڕدراوەکان",
    icon: Activity,
    count: totals?.totalPurchasePrice?.toLocaleString(),
    description: " لە هەفتەی ڕابردوو",
  },
  {
    title: "کۆی خەرجی",
    icon: Activity,
    count: totals?.totalExpenses?.toLocaleString(),
    description: " لە هەفتەی ڕابردوو",
  },
];

// Memoized components for better performance
const StatCard = memo(({ data }: { data: CardData }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
      <data.icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="flex gap-1 items-center text-2xl font-bold">
        <span className="text-xl">IQD </span>
        <span>{data.count}</span>
      </div>
      <p className="text-xs text-muted-foreground">{data.description}</p>
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
