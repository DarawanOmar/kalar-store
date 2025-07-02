import fs from "fs";
import path from "path";
import os from "os";
import mysqldump from "mysqldump";
import archiver from "archiver";
import { NextResponse } from "next/server";
import { ensureDirectoryExists } from "@/lib/helper";
import { uploadToDrive } from "@/lib/google-drive"; // Import the Google Drive function
import { sendLinkToTelegram } from "@/lib/telegramUtils";

const name = process.env.DB_NAME || "";
const host = process.env.DB_HOST || "";
const user = process.env.DB_USER || "";
const password = process.env.DB_PASS || "";
const chat_id = process.env.TELEGRAM_CHAT_ID || "";
const telegram_bot = process.env.TELEGRAM_BOT_TOKEN || "";

// Function to create a ZIP file
const createZip = (
  filePath: string,
  outputZipPath: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(
        `ZIP file created: ${outputZipPath} (${archive.pointer()} bytes)`
      );
      resolve(outputZipPath);
    });

    archive.on("error", (err: Error) => reject(err));

    archive.pipe(output);
    archive.file(filePath, { name: path.basename(filePath) });
    archive.finalize();
  });
};

const uploadBackupToGoogleDrive = async (
  filePath: string
): Promise<{ fileUrl: string; isUpdated: boolean }> => {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    const fileName = `database_backup_${dateString}.zip`;
    const fileBuffer = fs.readFileSync(filePath);

    // Upload to Google Drive
    return await uploadToDrive(fileBuffer, fileName, "application/zip");
  } catch (error: any) {
    console.error("Error uploading to Google Drive:", error);
    throw new Error(`Failed to upload to Google Drive: ${error.message}`);
  }
};

// API handler to perform database dump, zip, and upload to Google Drive
export async function POST(req: Request) {
  let dumpFilePath: string | null = null;
  let zipFilePath: string | null = null;

  try {
    const formData = await req.formData(); // Get upload option from request
    const uploadOption = formData.get("uploadOption")?.toString() || "local";

    dumpFilePath = path.join(os.tmpdir(), "backup.sql");
    zipFilePath = path.join(os.tmpdir(), "backup.zip");

    // Step 1: Generate the MySQL dump
    await mysqldump({
      connection: {
        host: host,
        user: user,
        password: password,
        database: name,
      },
      dumpToFile: dumpFilePath,
    });
    console.log(`Database dump created at: ${dumpFilePath}`);

    // Step 2: Create a ZIP file
    await createZip(dumpFilePath, zipFilePath);

    let resultMessage = "";
    let description = "";
    let fileUrl = "";

    // Handle different upload options
    if (uploadOption === "local") {
      // Save to local directory
      const destinationPath = path.join("D:", "Backups", "backup.zip");
      ensureDirectoryExists(path.dirname(destinationPath));
      fs.copyFileSync(zipFilePath, destinationPath);
      console.log(`Backup saved to: ${destinationPath}`);
      resultMessage = "سەرکەوتوو بوو";
      description = "باکئەپ کرا بۆ کۆمپیتەرەکە";
    } else {
      // Default: Upload to Google Drive
      const result = await uploadBackupToGoogleDrive(zipFilePath);
      fileUrl = result.fileUrl;
      console.log(
        `Backup ${
          result.isUpdated ? "updated" : "uploaded"
        } to Google Drive: ${fileUrl}`
      );
      resultMessage = "سەرکەوتوو بوو";
      description = "باکئەپ بۆ گووگڵ درایڤ ناردرا";
      await sendLinkToTelegram(fileUrl, telegram_bot, chat_id); // Send link to Telegram
    }

    return NextResponse.json({
      message: resultMessage,
      description: description,
      fileUrl: fileUrl || undefined,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({
      description: error.message,
      message: "هەڵەیەک ڕویدا",
    });
  } finally {
    // Clean up temporary files
    if (dumpFilePath && fs.existsSync(dumpFilePath)) {
      fs.unlinkSync(dumpFilePath);
    }
    if (zipFilePath && fs.existsSync(zipFilePath)) {
      fs.unlinkSync(zipFilePath);
    }
  }
}
