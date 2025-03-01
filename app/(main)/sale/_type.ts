import { z } from "zod";

export const addSale = z.object({
  invoice_number: z.string().min(1, { message: "ناو داخڵ بکە" }),
  type: z.string().min(1, { message: "جۆر داخڵ بکە" }),
  name: z.string().min(1, { message: "ناو داخڵ بکە" }),
  phone: z.string().min(1, { message: "ژمارەی مۆبایل داخڵ بکە" }),
  place: z.string().min(1, { message: "شوێن داخڵ بکە" }),
  note: z.string().min(1, { message: "تێبینی داخڵ بکە" }),
});

export type addSaleType = z.infer<typeof addSale>;

export const addProductSale = z.object({
  id: z.coerce.number().optional(),
  name: z.string().optional(),
  barcode: z.string().optional(),
  quantity: z.coerce
    .number({ message: "ژمارە داخڵ بکە" })
    .positive({ message: "ژمارەی نرخ بەرزترە لە سفر بێت" })
    .min(1, { message: "بڕ داخڵ بکە" }),
  // sale_price: z.string().optional(),
});

export type addProductSaleType = z.infer<typeof addProductSale>;

export const completeSale = z.object({
  discount: z.coerce.number().optional(),
});

export type completeSaleType = z.infer<typeof completeSale>;
export interface SaleProducts {
  id: number;
  name: string;
  barcode: string;
  quantity: number;
  purchase_price: number;
  sale_price: number;
}

export interface SaleInvoice {
  id: number;
  invoice_number: string;
  name: string;
  phone: string;
  place: string;
  is_done: boolean;
  note: string | null;
  discount: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleInvoiceItems {
  invoice_number: string;
  name: string;
  phone: string;
  place: string;
  note: string | null;
  Products: SaleInvoiceItem[];
}

export type SaleInvoiceItem = {
  id: number;
  product_id: number | null;
  quantity: number;
  name: string;
  barcode: string;
  sale_price: number;
};
