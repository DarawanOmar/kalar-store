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
import { Activity, ArrowUpRight, CreditCard, DollarSign } from "lucide-react";
import Link from "next/link";
import { getAllCompleteSaleInvoice } from "./sale-invoice/_lib";
import { getAllCompleteInvoice } from "./purchase-invoice/_lib";
import { format } from "date-fns";

const cardData = [
  {
    title: "کۆی داهات",
    icon: DollarSign,
    count: "$45,231.89",
    description: "+20.1% لە مانگی ڕابردوو",
  },

  {
    title: "کۆی فرۆشراوەکان",
    icon: CreditCard,
    count: "+12,234",
    description: "+19% لە مانگی ڕابردوو",
  },
  {
    title: "کۆی کڕدراوەکان",
    icon: Activity,
    count: "+573",
    description: "+201 since last hour",
  },
];

const recentSalesData = [
  {
    avatar: "/avatars/01.png",
    fallback: "OM",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
  },
  {
    avatar: "/avatars/02.png",
    fallback: "JL",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
  },
  {
    avatar: "/avatars/03.png",
    fallback: "IN",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
  },
  {
    avatar: "/avatars/04.png",
    fallback: "WK",
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
  },
  {
    avatar: "/avatars/05.png",
    fallback: "SD",
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
  },
];

export default async function Home() {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const [completeSaleInvoices, completeInvoices] = await Promise.all([
    getAllCompleteSaleInvoice(sevenDaysAgo, now, 1),
    getAllCompleteInvoice(sevenDaysAgo, now, 1),
  ]);
  return (
    <div className="flex flex-1 flex-col gap-4 my-10 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {cardData.map((card, index) => (
          <Card key={index} x-chunk={`dashboard-01-chunk-${index}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.count}</div>
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
                {completeInvoices.data?.formattedInvoices.map(
                  (invoice, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>{invoice.name}</div>
                      </TableCell>
                      <TableCell>{format(invoice.createdAt, "P")}</TableCell>
                      <TableCell>{invoice.total.toLocaleString()}-</TableCell>
                    </TableRow>
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
            {completeSaleInvoices.data?.formattedInvoices.map((sale, index) => (
              <div key={index} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src={"/empty-product.jpg"} alt="Avatar" />
                  <AvatarFallback>{}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {sale.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{sale.place}</p>
                </div>
                <div className="ms-auto font-medium">
                  {sale.total.toLocaleString()}+
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
