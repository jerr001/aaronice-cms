/**
 * Admin Page Content Detail API
 * GET /api/admin/pages/[pageId] - Get specific page content
 * PUT /api/admin/pages/[pageId] - Update specific page content
 * DELETE /api/admin/pages/[pageId] - Delete specific page content
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
  notFoundResponse,
} from "@/lib/utils/response";

const VALID_PAGE_IDS = [
  "home",
  "about",
  "services",
  "contact",
  "footer",
  "pricing",
] as const;

export const GET = withAdminAuth(
  async (request: NextRequest, { params }: { params: { pageId: string } }) => {
    try {
      const { pageId } = params;

      // Validate pageId
      if (!VALID_PAGE_IDS.includes(pageId as any)) {
        return errorResponse("Invalid page ID", 400);
      }

      // Wait for page storage to be ready
      await waitForPagesStoreReady();

      // Try file-based storage first
      const pageStorage = getPageStorage();
      const page = pageStorage.getByPageId(pageId);

      if (!page) {
        // Could create default page here if needed
        return notFoundResponse("Page content");
      }

      console.log(`[Pages API] Retrieved page from file storage: ${pageId}`);
      return successResponse(page);
    } catch (error) {
      console.error("[Page Get Error]", error);
      return errorResponse(
        error instanceof Error ? error.message : "Failed to get page content",
        500,
      );
    }
  },
);

export const PUT = withAdminAuth(
  async (request: NextRequest, { params }: { params: { pageId: string } }) => {
    try {
      const { pageId } = params;
      const body = await request.json();

      // Validate pageId
      if (!VALID_PAGE_IDS.includes(pageId as any)) {
        return errorResponse("Invalid page ID", 400);
      }

      // Validate input
      const validation = UpdatePageContentValidator.safeParse({
        pageId,
        ...body,
      });
      if (!validation.success) {
        return validationErrorResponse(validation.error);
      }

      // Wait for page storage to be ready
      await waitForPagesStoreReady();

      // ALWAYS save to file-based storage
      const pageStorage = getPageStorage();
      const updated = pageStorage.update(pageId, validation.data as any);

      // Also try MongoDB for sync (non-blocking)
      try {
        const pageRepo = await getPageContentRepository();
        await pageRepo.upsert(pageId as any, validation.data as any);
        console.log("[Pages API] Synced to MongoDB:", pageId);
      } catch (mongoError) {
        console.log(
          "[Pages API] MongoDB sync skipped (not available):",
          mongoError instanceof Error ? mongoError.message : "Unknown error",
        );
      }

      console.log("[Pages API] Page updated in file storage:", pageId);
      return successResponse(updated, "Page content updated successfully");
    } catch (error) {
      console.error("[Page Update Error]", error);
      return errorResponse(
        error instanceof Error
          ? error.message
          : "Failed to update page content",
        500,
      );
    }
  },
);

export const DELETE = withAdminAuth(
  async (request: NextRequest, { params }: { params: { pageId: string } }) => {
    try {
      const { pageId } = params;

      // Wait for page storage to be ready
      await waitForPagesStoreReady();

      const pageStorage = getPageStorage();
      const deleted = pageStorage.delete(pageId);

      if (!deleted) {
        return notFoundResponse("Page content");
      }

      // Also try MongoDB for sync (non-blocking)
      try {
        const pageRepo = await getPageContentRepository();
        await pageRepo.delete(pageId as any);
        console.log("[Pages API] Deleted from MongoDB:", pageId);
      } catch (mongoError) {
        console.log(
          "[Pages API] MongoDB delete skipped (not available):",
          mongoError instanceof Error ? mongoError.message : "Unknown error",
        );
      }

      console.log("[Pages API] Page deleted from file storage:", pageId);
      return successResponse(null, "Page content deleted successfully");
    } catch (error) {
      console.error("[Page Delete Error]", error);
      return errorResponse(
        error instanceof Error
          ? error.message
          : "Failed to delete page content",
        500,
      );
    }
  },
);
