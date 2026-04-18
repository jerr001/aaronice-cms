/**
 * Admin Media Upload API
 * POST /api/admin/media/upload - Upload an image
 * Returns: { success, url, filename, size }
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { withAdminAuth } from "@/lib/auth/middleware";
import { errorResponse, successResponse } from "@/lib/utils/response";
import { generateToken } from "@/lib/auth/crypto";

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("No file provided", 400);
    }

    // Validate file type
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedMimes.includes(file.type)) {
      return errorResponse(
        "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed",
        400,
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return errorResponse("File too large. Maximum size is 5MB", 400);
    }

    // Generate filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${generateToken(8)}.${ext}`;
    const timestamp = new Date().toISOString().split("T")[0];
    const folder = `uploads/${timestamp}`;

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", folder);
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filepath = join(uploadDir, filename);
    const buffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer) as any);

    const url = `/${folder}/${filename}`;

    return successResponse(
      {
        filename,
        url,
        size: file.size,
        type: file.type,
      },
      "Image uploaded successfully",
      201,
    );
  } catch (error) {
    console.error("[Media Upload Error]", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to upload image",
      500,
    );
  }
});
