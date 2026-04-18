/**
 * Media Check API
 * GET /api/media/check?path=/uploads/filename.png
 * Check if a file is accessible and valid
 */

import { NextRequest, NextResponse } from "next/server";
import { existsSync, statSync } from "fs";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json(
        { error: "Missing path parameter" },
        { status: 400 },
      );
    }

    // Remove leading slash if present
    const normalizedPath = filePath.startsWith("/")
      ? filePath.slice(1)
      : filePath;
    const fullPath = join(process.cwd(), "public", normalizedPath);

    console.log("[Media Check]");
    console.log("  Requested path:", filePath);
    console.log("  Normalized path:", normalizedPath);
    console.log("  Full path:", fullPath);

    // Check if file exists
    const exists = existsSync(fullPath);
    console.log("  File exists:", exists);

    if (!exists) {
      return NextResponse.json(
        {
          accessible: false,
          error: "File not found",
          path: filePath,
          fullPath,
        },
        { status: 404 },
      );
    }

    // Get file stats
    const stats = statSync(fullPath);
    console.log("  File size:", stats.size, "bytes");
    console.log("  Is file:", stats.isFile());
    console.log("  Is readable:", (stats.mode | 0o400) !== 0);

    return NextResponse.json({
      accessible: true,
      path: filePath,
      size: stats.size,
      isFile: stats.isFile(),
      created: stats.birthtime,
      modified: stats.mtime,
      mode: `0o${stats.mode.toString(8)}`,
      message: `✓ File is accessible and ${stats.size} bytes`,
    });
  } catch (error) {
    console.error("[Media Check] Error:", error);
    return NextResponse.json(
      {
        accessible: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
