"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart with a label";

const chartConfig = {} satisfies ChartConfig;

type Props = {
  data: any[];
  range: string;
};

export function ChartBarLabel({ data, range }: Props) {
  const [start, end] = range?.split("to");
  return (
    <Card>
      <CardHeader>
        <CardTitle>کۆی زانیارەکان</CardTitle>
        <CardDescription>
          {start || "00-00-20??"} - {end || "00-00-20??"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="sales" radius={8}>
              <LabelList position="top" offset={12} fontSize={12} />
            </Bar>
            <Bar dataKey="purchases" radius={8}>
              <LabelList position="top" offset={12} fontSize={12} />
            </Bar>
            <Bar dataKey="profit" radius={8}>
              <LabelList position="top" offset={12} fontSize={12} />
            </Bar>
            <Bar dataKey="expenses" radius={8}>
              <LabelList position="top" offset={12} fontSize={12} />
            </Bar>
            <Bar dataKey="cashSales" radius={8}>
              <LabelList position="top" offset={12} fontSize={12} />
            </Bar>
            <Bar dataKey="loanSales" radius={8}>
              <LabelList position="top" offset={12} fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
