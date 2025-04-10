// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { uploadToDrive } from "@/lib/google-drive";

// Must match the runtime of the imported module
export const runtime = "nodejs"; // Critical - must be Node.js to use googleapis

export async function POST(request: Request) {
  try {
    // Verify environment variables
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error("Google Drive credentials not configured");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadToDrive(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      fileUrl,
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
