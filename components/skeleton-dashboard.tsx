import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Activity, ArrowUpRight, CreditCard, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function SkeletonDashboard() {
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
              <Skeleton className="h-7 w-32 mb-1" />
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
                {Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                  </TableRow>
                ))}
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
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src={"/empty-product.jpg"} alt="Avatar" />
                  <AvatarFallback>{}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="ms-auto font-medium">
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SkeletonDashboard;

export const cardData = [
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
  {
    title: "کۆی خەرجی",
    icon: Activity,
    count: "+573",
    description: "+201 since last hour",
  },
];
