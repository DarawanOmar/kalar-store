import { z } from "zod";

export const addSale = z.object({
  name: z.string().min(1, { message: "ناو داخڵ بکە" }),
  phone: z.string().min(1, { message: "ژمارەی مۆبایل داخڵ بکە" }),
  place: z.string().min(1, { message: "شوێن داخڵ بکە" }),
  note: z.string().min(1, { message: "تێبینی داخڵ بکە" }),
});

export type addSaleType = z.infer<typeof addSale>;

export const addProductSale = z.object({
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
  sale_price: z.coerce
    .number({ message: "ژمارە داخڵ بکە" })
    .positive({ message: "ژمارەی نرخ بەرزترە لە سفر بێت" })
    .min(1, { message: "نرخی کڕین داخڵ بکە" }),
});

export type addProductSaleType = z.infer<typeof addProductSale>;

export interface SaleProducts {
  id: number;
  name: string;
  barcode: string;
  quantity: number;
  purchase_price: number;
  sale_price: number;
}
