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
import { getTotalRevenue } from "./_lib";

export default async function FeedDashboard() {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const [totals, completeSaleInvoices, completeInvoices] = await Promise.all([
    getTotalRevenue(sevenDaysAgo, now),
    getAllCompleteSaleInvoice(sevenDaysAgo, now, 1),
    getAllCompleteInvoice(sevenDaysAgo, now, 1),
  ]);
  // console.log(totals);
  return (
    <div className="flex flex-1 flex-col gap-4 my-10 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {[
          {
            title: "کۆی داهات",
            icon: DollarSign,
            count: totals?.totalRevenue?.toLocaleString(),
            description: " لە هەفتەی ڕابردوو",
          },
          // {
          //   title: "کۆی زەرەر",
          //   icon: DollarSign,
          //   count: totals?.lossPrice?.toLocaleString(),
          //   description: " لە هەفتەی ڕابردوو",
          // },

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
        ].map((card, index) => (
          <Card key={index} x-chunk={`dashboard-01-chunk-${index}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-1 items-center text-2xl font-bold">
                <span className="text-xl">IQD </span>
                <span>{card.count}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 2xl:grid-cols-2">
        <Card
          className="2xl:col-span-1 max-h-max"
          x-chunk="dashboard-01-chunk-4"
        >
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>کڕینەکان</CardTitle>
              <CardDescription>
                کڕینەکان لە ماوەی هەفتەی ڕابردوو
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ms-auto gap-1">
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
                {completeInvoices.data?.formattedInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      هیچ کڕینێک تۆمار نەکراوە
                    </TableCell>
                  </TableRow>
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
        <Card x-chunk="dashboard-01-chunk-5" className="max-h-max">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>فرۆشتن لەم دواییانەدا</CardTitle>
              <CardDescription>
                فرۆشتنەکان لە ماوەی هەفتەی ڕابردوو
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ms-auto gap-1">
              <Link href="/purchase-invoice">
                <ArrowUpRight className="h-4 w-4" />
                بینینی هەموویان
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-8">
            {completeInvoices.data?.formattedInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  هیچ فرۆشتنێک تۆمار نەکراوە
                </TableCell>
              </TableRow>
            ) : (
              completeSaleInvoices.data?.formattedInvoices.map(
                (sale, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src={"/empty-product.jpg"} alt="Avatar" />
                      <AvatarFallback>{}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {sale.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sale.place}
                      </p>
                    </div>
                    <div className="flex flex-col ms-auto font-medium">
                      <span>{sale.total.toLocaleString()}+</span>
                      <span>
                        {sale.discount ? (
                          <div className="flex items-center">
                            <span className="text-xs">
                              {sale.discount?.toLocaleString()}
                            </span>
                            <Percent size={12} />
                          </div>
                        ) : null}
                      </span>
                    </div>
                  </div>
                )
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
