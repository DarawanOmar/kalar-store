import { z } from "zod";

export const returnItem = z.object({
  quantity: z.coerce
    .number({ message: "ژمارە داخڵ بکە" })
    .min(1, { message: "بڕ داخڵ بکە" }),
});

export type returnItemType = z.infer<typeof returnItem>;

export interface SaleInvoice {
  id: number;
  name: string;
  invoice_number: string;
  is_discount: boolean;
  discount: number | null;
  createdAt: Date;
  place: string;
  type: string;
  total: number;
}
