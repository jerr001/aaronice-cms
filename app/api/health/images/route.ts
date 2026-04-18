/**
 * Health Check API
 * GET /api/health/images
 * Verify image serving is working correctly
 */

import { NextResponse } from "next/server";
import { existsSync, statSync, readdirSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), "public", "uploads");
    const publicDir = join(process.cwd(), "public");

    console.log("[Health Check] Testing image serving...");
    console.log("  Current working directory:", process.cwd());
    console.log("  Public directory:", publicDir);
    console.log("  Uploads directory:", uploadsDir);

    // Check public dir exists
    const publicExists = existsSync(publicDir);
    console.log("  /public exists:", publicExists);

    // Check uploads dir exists
    const uploadsExists = existsSync(uploadsDir);
    console.log("  /public/uploads exists:", uploadsExists);

    let uploadedFiles: { name: string; size: number; mtime: string }[] = [];

    if (uploadsExists) {
      try {
        const files = readdirSync(uploadsDir);
        console.log("  Total files in /uploads:", files.length);

        // Get first 5 files as examples
        uploadedFiles = files
          .slice(0, 5)
          .filter((f) => !f.startsWith("."))
          .map((filename) => {
            try {
              const stats = statSync(join(uploadsDir, filename));
              return {
                name: filename,
                size: stats.size,
                mtime: stats.mtime.toISOString(),
              };
            } catch (e) {
              return {
                name: filename,
                size: 0,
                mtime: "error",
              };
            }
          });
      } catch (e) {
        console.error("Error reading uploads:", e);
      }
    }

    // Test serving path
    const testPath = "/uploads/test.png";
    const testFullPath = join(publicDir, "uploads", "test.png");
    const testPathExists = existsSync(testFullPath);

    return NextResponse.json({
      status: "ok",
      staticFileServing: {
        publicExists,
        uploadsExists,
        publicPath: publicDir,
        uploadsPath: uploadsDir,
        filesInUploads: uploadedFiles.length,
        sampleFiles: uploadedFiles,
      },
      testServing: {
        path: testPath,
        fullPath: testFullPath,
        exists: testPathExists,
        message: testPathExists
          ? `✓ Test file exists at ${testPath}`
          : `✗ Would serve from: ${testPath}`,
      },
      summary: uploadsExists
        ? `✓ Image serving should work. ${uploadedFiles.length} files found in /uploads.`
        : "✗ /public/uploads directory not found",
    });
  } catch (error) {
    console.error("[Health Check] Error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
