import { z } from "zod";

export const addUser = z.object({
  name: z.string().min(1, { message: "ناو داخڵ بکە" }),
  email: z
    .string()
    .email({ message: " شێوەی ئیمەیڵی نییە " })
    .min(1, { message: "تێبینی داخڵ بکە" }),
  password: z.string().optional(),
});

export type addUserType = z.infer<typeof addUser>;

export interface User {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  id: number;
}
