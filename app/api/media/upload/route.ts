/**
 * Media Upload API
 * POST /api/media/upload
 * Accepts image files and saves to public/uploads/
 * Only authenticated admins can upload
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { verifyJWT } from "@/lib/auth/jwt";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    console.log("=== Media Upload Started ===");
    console.log("Timestamp:", new Date().toISOString());

    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Auth failed: Missing or invalid auth header");
      return errorResponse("Missing authorization", 401, "NO_AUTH");
    }

    const token = authHeader.slice(7);
    let decoded;
    try {
      decoded = verifyJWT(token);
      console.log("✓ Auth verified");
    } catch (error) {
      console.log("✗ Auth failed: Invalid token", error);
      return errorResponse("Invalid token", 401, "INVALID_TOKEN");
    }

    // Get form data
    console.log("Reading form data...");
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("✗ No file provided");
      return errorResponse("No file provided", 400, "NO_FILE");
    }

    console.log(
      "✓ File received:",
      file.name,
      "- Size:",
      file.size,
      "- Type:",
      file.type,
    );

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      console.log("✗ Invalid file type:", file.type);
      return errorResponse(
        "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG",
        400,
        "INVALID_TYPE",
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.log("✗ File too large:", file.size, "bytes");
      return errorResponse(
        "File too large. Maximum size is 5MB",
        400,
        "FILE_TOO_LARGE",
      );
    }

    // Create uploads directory if it doesn't exist
    console.log("Preparing upload directory...");
    const uploadsDir = join(process.cwd(), "public", "uploads");
    console.log("Upload directory path:", uploadsDir);

    try {
      if (!existsSync(uploadsDir)) {
        console.log("Creating uploads directory...");
        await mkdir(uploadsDir, { recursive: true });
        console.log("✓ Uploads directory created");
      } else {
        console.log("✓ Uploads directory already exists");
      }
    } catch (dirError) {
      console.error("✗ Failed to create/access uploads directory:", dirError);
      return errorResponse(
        "Failed to prepare upload directory",
        500,
        "DIR_ERROR",
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const originalName = file.name
      .replace(/[^a-z0-9.-]/gi, "_")
      .toLowerCase()
      .replace(/\s+/g, "_");
    const filename = `${timestamp}-${random}-${originalName}`;

    console.log("Generated filename:", filename);

    // Save file
    console.log("Converting file to buffer...");
    const buffer = await file.arrayBuffer();
    console.log("✓ Buffer ready, size:", buffer.byteLength, "bytes");

    const uint8Array = new Uint8Array(buffer);
    const filepath = join(uploadsDir, filename);
    console.log("Writing to path:", filepath);

    try {
      await writeFile(filepath, uint8Array);
      console.log("✓ File written successfully");
    } catch (writeError) {
      console.error("✗ Failed to write file:", writeError);
      return errorResponse(
        "Failed to write file to disk: " +
          (writeError instanceof Error
            ? writeError.message
            : String(writeError)),
        500,
        "WRITE_ERROR",
      );
    }

    // Return file info
    const url = `/uploads/${filename}`;
    console.log("✓ Upload complete - URL:", url);
    console.log("✓ Full file path:", filepath);

    // Verify file was actually written
    const fileExists = existsSync(filepath);
    console.log("✓ File exists on disk:", fileExists);

    if (!fileExists) {
      console.error("✗ ERROR: File was not written to disk!");
      return errorResponse(
        "File upload failed - file was not saved to disk",
        500,
        "FILE_NOT_SAVED",
      );
    }

    console.log("Total time:", Date.now() - startTime, "ms");

    return successResponse({
      message: "File uploaded successfully",
      file: {
        name: file.name,
        filename,
        url,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("=== Upload error ===", error);
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error,
    );
    console.error("Stack:", error instanceof Error ? error.stack : "N/A");
    console.log("Total time before crash:", Date.now() - startTime, "ms");

    return errorResponse(
      error instanceof Error ? error.message : "Upload failed",
      500,
      "UPLOAD_ERROR",
    );
  }
}
