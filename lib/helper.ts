"use server";

import fs, { unlink } from "fs";
import path from "path";

export const ensureDirectoryExists = async (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  }
};

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
