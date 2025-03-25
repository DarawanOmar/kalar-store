import { z } from "zod";

export const payLoan = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "ژمارەی ناقس داخڵ مەکە" })
    .min(1, { message: "پارە داخڵ بکە" }),
  note: z.string().optional(),
});

export type payLoanType = z.infer<typeof payLoan>;
