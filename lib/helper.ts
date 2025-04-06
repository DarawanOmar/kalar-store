"use server";

import { unlink } from "fs";
import path from "path";

export async function unlinkImage(
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const fullPath = path.join(process.cwd(), "public", filePath);
    unlink(fullPath, (err) => {
      if (err) throw err;
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "سڕینەوەی وێنە سەرکەوتوو نەبوو",
    };
  }
}
