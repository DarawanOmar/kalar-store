import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Users,
} from "lucide-react";
import Link from "next/link";

const cardData = [
  {
    title: "کۆی داهات",
    icon: DollarSign,
    count: "$45,231.89",
    description: "+20.1% لە مانگی ڕابردوو",
  },
  {
    title: "کۆی قەرزەکان",
    icon: Users,
    count: "+2350",
    description: "+180.1% لە مانگی ڕابردوو",
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

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 2xl:grid-cols-3">
        <Card className="2xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>ئاڵوگۆڕەکان</CardTitle>
              <CardDescription>ئاڵوگۆڕەکان لە ماوەی ڕابردوو</CardDescription>
            </div>
            <Button asChild size="sm" className="ms-auto gap-1">
              <Link href="#">
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
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                  </TableCell>
                  <TableCell>2023-06-23</TableCell>
                  <TableCell>$250.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>فرۆشتن لەم دواییانەدا</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {recentSalesData.map((sale, index) => (
              <div key={index} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src={sale.avatar} alt="Avatar" />
                  <AvatarFallback>{sale.fallback}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {sale.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{sale.email}</p>
                </div>
                <div className="ms-auto font-medium">{sale.amount}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
