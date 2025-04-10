"use server";

import fs from "fs";
import path from "path";

export const sendFilesToTelegram = async (
  filePaths: string[],
  token: string,
  chatId: string
) => {
  // Get the current date in the format YYYY-MM-DD
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(currentDate.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  for (const filePath of filePaths) {
    try {
      // Get the original filename and extension
      const originalFilename = path.basename(filePath);
      const extension = path.extname(originalFilename);
      const filenameWithoutExtension = path.basename(
        originalFilename,
        extension
      );

      // Create a new filename with the current date
      const newFilename = `${filenameWithoutExtension}_${dateString}${extension}`;

      // Create FormData and append the file with the new filename
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append(
        "document",
        new Blob([fs.readFileSync(filePath)]),
        newFilename // Use the new filename here
      );
      formData.append("caption", `Part: ${newFilename}`);
      formData.append("disable_notification", "true");

      // Send the file to Telegram
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendDocument`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `هەڵەیەک لەناردنی فایل بۆ تێلێگرام هەیە: ${response.statusText}`
        );
      }

      console.log(`Backup part sent: ${newFilename}`);
    } catch (error: any) {
      console.error("Error sending file to Telegram:", error.message);
      throw new Error(`Error sending file: ${error.message}`);
    }
  }
};

export const sendLinkToTelegram = async (
  link: string,
  token: string,
  chatId: string
) => {
  // Get the current date in the format YYYY-MM-DD
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(currentDate.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  try {
    const formData = new FormData();
    formData.append("caption", `Link : ${link}`);
    formData.append("disable_notification", "true");

    // Send the file to Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${link}`,
      // `https://api.telegram.org/bot${token}/sendDocument`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(
        `هەڵەیەک لەناردنی فایل بۆ تێلێگرام هەیە: ${response.statusText}`
      );
    }
  } catch (error: any) {
    console.error("Error sending file to Telegram:", error.message);
    throw new Error(`Error sending file: ${error.message}`);
  }
};
