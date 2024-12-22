import { sizeImage } from "@/lib/globals";
import { z } from "zod";

export const addUser = z.object({
  name: z.string().min(1, { message: "ناو داخڵ بکە" }),
  email: z
    .string()
    .email({ message: " شێوەی ئیمەیڵی نییە " })
    .min(1, { message: "تێبینی داخڵ بکە" }),
  password: z.string().optional(),
  image: z
    .instanceof(File) // Ensure the value is of type `File`
    .refine((file) => file.size < sizeImage, {
      message: "File size must be less than 1MB",
    })
    .nullable(),
});

export type addUserType = z.infer<typeof addUser>;

export interface User {
  name: string;
  email: string;
  password: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  id: number;
}
