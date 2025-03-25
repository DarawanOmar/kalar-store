import { z } from "zod";
import { type Product } from "@/app/(main)/products/_type";
export const addInvoice = z.object({
  invoice_number: z.string().min(1, { message: "ژمارەی پسووڵە داخڵ بکە" }),
  name: z.string().min(1, { message: "ناو داخڵ بکە" }),
  place: z.string().min(1, { message: "شوێن داخڵ بکە" }),
  note: z.string().min(1, { message: "تێبینی داخڵ بکە" }),
});

export type addInvoiceType = z.infer<typeof addInvoice>;

export const addProductPurchase = z.object({
  id: z.coerce.number().optional(),
  name: z.string().optional(),

  quantity: z.coerce
    .number({ message: "ژمارە داخڵ بکە" })
    .positive({ message: "ژمارەی نرخ بەرزترە لە سفر بێت" })
    .min(1, { message: "بڕ داخڵ بکە" }),
  purchase_price: z.coerce.number().optional(),
});

export type addProductPurchaseType = z.infer<typeof addProductPurchase>;

export interface PurchaseProducts {
  id: number;
  name: string;
  barcode: string;
  quantity: number;
  purchase_price: number;
}
export interface Invoice {
  invoice_number: string;
  name: string;
  place: string;
  note: string | null;
  is_done: boolean;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseInvice {
  id: number;
  purchase_invoiceId: number;
  product_id: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  Products: Product;
  Purchase_invoice: Invoice;
}
