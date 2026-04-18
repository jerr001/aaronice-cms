/**
 * Admin Page Content API
 * GET /api/admin/pages - Get all page content
 * POST /api/admin/pages - Create new page content
 * Uses file-based storage as primary, MongoDB as fallback
 */

import { NextRequest } from "next/server";
import { UpdatePageContentValidator } from "@/lib/validators/blog";
import { getPageStorage, waitForPagesStoreReady } from "@/lib/page-storage";
import { getPageContentRepository } from "@/lib/db/index";
import { withAdminAuth } from "@/lib/auth/middleware";
import {
  errorResponse,
  validationErrorResponse,
  successResponse,
} from "@/lib/utils/response";

export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    // Wait for page storage to be ready
    await waitForPagesStoreReady();

    // Try file-based storage first (always available)
    const pageStorage = getPageStorage();
    const pages = pageStorage.getAll();

    console.log("[Pages API] Retrieved pages from file storage:", pages.length);
    return successResponse(pages);
  } catch (error) {
    console.error("[Page List Error]", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to list pages",
      500,
    );
  }
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate input
    const validation = UpdatePageContentValidator.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    // Wait for page storage to be ready
    await waitForPagesStoreReady();

    // ALWAYS save to file-based storage (reliable)
    const pageStorage = getPageStorage();
    const page = pageStorage.update(
      validation.data.pageId,
      validation.data as any,
    );

    // Also try MongoDB for sync (non-blocking)
    try {
      const pageRepo = await getPageContentRepository();
      await pageRepo.upsert(validation.data.pageId, validation.data as any);
      console.log("[Pages API] Synced to MongoDB");
    } catch (mongoError) {
      console.log(
        "[Pages API] MongoDB sync skipped (not available):",
        mongoError instanceof Error ? mongoError.message : "Unknown error",
      );
    }

    console.log(
      "[Pages API] Page saved to file storage:",
      validation.data.pageId,
    );
    return successResponse(page, "Page content saved successfully", 201);
  } catch (error) {
    console.error("[Page Create Error]", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to save page content",
      500,
    );
  }
});
