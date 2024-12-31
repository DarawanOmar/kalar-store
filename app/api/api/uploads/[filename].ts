import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filename } = req.query;
  const filePath = path.join(process.cwd(), "uploads", filename as string);

  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "image/jpeg"); // Adjust MIME type as needed
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).send("Image not found");
  }
}
