"use server";
import { loginSchemaType } from "../_component/lib";
import db from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function loginAction(data: loginSchemaType) {
  try {
    const user = await db.users.findFirst({ where: { email: data.email } });
    if (!user) {
      return {
        success: false,
        message: "ئیمەیڵ هەڵەیە",
      };
    }
    console.log("User => ", user);
    const isMatch = await bcrypt.compare(
      data.password,
      user?.password as string
    );
    if (isMatch) {
      return {
        success: true,
        data: user,
        message: "بە سەرکەوتویی چوویتەژورەوە",
      };
    }
    return {
      success: false,
      message: "پاسۆرد هەڵەیە",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "هەڵەیەک هەیە",
    };
  }
}
