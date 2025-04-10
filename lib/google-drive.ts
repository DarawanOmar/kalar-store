// lib/google-drive.ts
export const runtime = "nodejs"; // Ensures this only runs in Node.js environment
import { google } from "googleapis";
import { Readable } from "stream";

// This entire file is Node.js specific and cannot run in Edge

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

export async function uploadToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const fileMetadata = {
    name: fileName,
    parents: process.env.GOOGLE_DRIVE_FOLDER_ID
      ? [process.env.GOOGLE_DRIVE_FOLDER_ID]
      : [],
  };

  const media = {
    mimeType,
    body: Readable.from(fileBuffer),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "webViewLink,id",
  });

  // Make the file publicly readable (optional)
  await drive.permissions.create({
    fileId: response.data.id!,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return (
    response.data.webViewLink ||
    `https://drive.google.com/file/d/${response.data.id}/view`
  );
}
