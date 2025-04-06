import { sizeImage } from "@/lib/globals";
import { z } from "zod";

export const addProduct = z.object({
  name: z.string().min(1, { message: "ناو داخڵ بکە" }),
  barcode: z.string().min(1, { message: "ناو داخڵ بکە" }),
  quantity: z.coerce.number({ message: "ژمارە داخڵ بکە" }).optional(),
  sale_price: z.coerce
    .number({ message: "ژمارە داخڵ بکە" })
    .positive({ message: "ژمارەی نرخ بەرزترە لە سفر بێت" })
    .min(1, { message: "نرخی فرۆشتن داخڵ بکە" }),
  purchase_price: z.coerce
    .number({ message: "ژمارە داخڵ بکە" })
    .positive({ message: "ژمارەی نرخ بەرزترە لە سفر بێت" })
    .min(1, { message: "نرخی کڕین داخڵ بکە" }),
  note: z.string().min(1, { message: "تێبینی داخڵ بکە" }),
  image: z.any().optional(),
  // image: z
  //   .instanceof(File) // Ensure the value is of type `File`
  //   .refine((file) => file.size < sizeImage, {
  //     message: "File size must be less than 1 MB",
  //   })
  //   .nullable(),
});

export type addProductType = z.infer<typeof addProduct>;

export interface Product {
  id: number;
  name: string;
  barcode: string;
  image: string | null;
  sale_price: number;
  purchase_price: number;
  quantity: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}
