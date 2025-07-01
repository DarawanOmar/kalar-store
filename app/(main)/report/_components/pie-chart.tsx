"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A pie chart with no separator";

const chartConfig = {
  value: {
    label: "Values",
  },
  Purchases: {
    label: "Purchases",
    color: "#022c22",
  },
  Expenses: {
    label: "Expenses",
    color: "#022c54",
  },
  "Total Sales": {
    label: "Total Sales",
    color: "#422006",
  },
} satisfies ChartConfig;

type Props = {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
  range: string; // Optional range prop for future use
};
export function ChartPie({ data, range }: Props) {
  const [start, end] = range?.split("to");
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>کۆی کڕین و فرۆشتنەکان</CardTitle>
        <CardDescription>
          {start || "00-00-20??"} - {end || "00-00-20??"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={data} dataKey="value" />
            <ChartLegend
              content={<ChartLegendContent payload={[]} nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
