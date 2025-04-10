import { NextResponse } from "next/server";
import { uploadToDrive } from "@/lib/google-drive";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error("Google Drive credentials not configured");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { fileUrl, isUpdated } = await uploadToDrive(
      buffer,
      file.name,
      file.type
    );

    return NextResponse.json({
      success: true,
      fileUrl,
      isUpdated,
      message: isUpdated
        ? "File updated successfully"
        : "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 }
    );
  }
}
