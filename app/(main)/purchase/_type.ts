import { z } from "zod";

export const addInvoice = z.object({
  invoice_number: z.string().min(1, { message: "ژمارەی پسووڵە داخڵ بکە" }),
  name: z.string().min(1, { message: "ناو داخڵ بکە" }),
  place: z.string().min(1, { message: "شوێن داخڵ بکە" }),
  note: z.string().min(1, { message: "تێبینی داخڵ بکە" }),
});

export type addInvoiceType = z.infer<typeof addInvoice>;

export const addProductPurchase = z.object({
  name: z.string().min(1, { message: "ناو داخڵ بکە" }),
  barcode: z.string().min(1, { message: "ناو داخڵ بکە" }),
  quantity: z.coerce
    .number({ message: "ژمارە داخڵ بکە" })
    .positive({ message: "ژمارەی نرخ بەرزترە لە سفر بێت" })
    .min(1, { message: "بڕ داخڵ بکە" }),
  purchase_price: z.coerce
    .number({ message: "ژمارە داخڵ بکە" })
    .positive({ message: "ژمارەی نرخ بەرزترە لە سفر بێت" })
    .min(1, { message: "نرخی کڕین داخڵ بکە" }),
});

export type addProductPurchaseType = z.infer<typeof addProductPurchase>;

export interface PurchaseProducts {
  id: number;
  name: string;
  barcode: string;
  quantity: number;
  purchase_price: number;
}
