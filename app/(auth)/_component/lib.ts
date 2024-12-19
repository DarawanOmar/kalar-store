import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, { message: "تکایە ئیمەیڵ داخڵ بکە" }).email(),
  password: z.string().min(1, { message: "تکایە پاسؤرد داخڵ بکە" }),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
