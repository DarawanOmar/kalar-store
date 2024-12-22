import { z } from "zod";

export const addExpenses = z.object({
  name: z.string().min(1, { message: "ناو داخڵ بکە" }),
  quantity: z.coerce
    .number({ message: "ژمارە داخڵ بکە" })
    .positive({ message: "ژمارەی نرخ بەرزترە لە سفر بێت" })
    .min(1, { message: "بڕ داخڵ بکە" }),
  price: z.coerce
    .number({ message: "ژمارە داخڵ بکە" })
    .positive({ message: "ژمارەی نرخ بەرزترە لە سفر بێت" })
    .min(1, { message: "نرخی فرۆشتن داخڵ بکە" }),
  note: z.string().min(1, { message: "تێبینی داخڵ بکە" }),
});

export type addExpensesType = z.infer<typeof addExpenses>;

export interface Expenses {
  id: number;
  name: string;
  price: number;
  quantity: number;
  note: string | null;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
