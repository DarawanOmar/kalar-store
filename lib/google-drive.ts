// lib/google-drive.ts
import { google } from "googleapis";
import { Readable } from "stream";

export const runtime = "nodejs";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

/**
 * Search for a file in Google Drive by name
 * @param fileName Name of the file to search for
 * @returns File ID if found, null otherwise
 */
async function findFileByName(fileName: string): Promise<string | null> {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    let query = `name = '${fileName}' and trashed = false`;

    // If folder ID is specified, add it to the query
    if (folderId) {
      query += ` and '${folderId}' in parents`;
    }

    const response = await drive.files.list({
      q: query,
      fields: "files(id, name, webViewLink)",
      spaces: "drive",
    });

    const files = response.data.files;
    if (files && files.length > 0) {
      return files[0].id || null;
    }
    return null;
  } catch (error) {
    console.error("Error finding file:", error);
    return null;
  }
}

/**
 * Update an existing file in Google Drive
 * @param fileId ID of the file to update
 * @param fileBuffer The file content
 * @param mimeType The MIME type of the file
 * @returns URL of the updated file
 */
async function updateDriveFile(
  fileId: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<string> {
  const media = {
    mimeType,
    body: Readable.from(fileBuffer),
  };

  const response = await drive.files.update({
    fileId,
    media,
    fields: "webViewLink,id",
  });

  return (
    response.data.webViewLink ||
    `https://drive.google.com/file/d/${response.data.id}/view`
  );
}

/**
 * Create a new file in Google Drive
 * @param fileBuffer The file content
 * @param fileName Name of the file
 * @param mimeType The MIME type of the file
 * @returns URL of the created file
 */
async function createDriveFile(
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

/**
 * Upload file to Google Drive or update if it exists
 * @param fileBuffer The file content
 * @param fileName Name of the file
 * @param mimeType The MIME type of the file
 * @returns URL of the file in Google Drive
 */
export async function uploadToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ fileUrl: string; isUpdated: boolean }> {
  // Check if file already exists
  const existingFileId = await findFileByName(fileName);

  if (existingFileId) {
    // Update existing file
    const fileUrl = await updateDriveFile(existingFileId, fileBuffer, mimeType);
    return { fileUrl, isUpdated: true };
  } else {
    // Create new file
    const fileUrl = await createDriveFile(fileBuffer, fileName, mimeType);
    return { fileUrl, isUpdated: false };
  }
}
