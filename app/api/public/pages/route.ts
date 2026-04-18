/**
 * Public Page Content API
 * GET /api/public/pages - Get all page content
 * GET /api/public/pages/[pageId] - Get specific page content
 * Uses file-based storage as primary, MongoDB as fallback
 */

import { NextRequest, NextResponse } from "next/server";
import { getPageStorage, waitForPagesStoreReady } from "@/lib/page-storage";
import { getPageContentRepository } from "@/lib/db/index";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/utils/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId");

    // Wait for page storage to be ready
    await waitForPagesStoreReady();

    // Try file-based storage first (always available)
    const pageStorage = getPageStorage();

    if (pageId) {
      // Get specific page
      const validPageIds = [
        "home",
        "about",
        "services",
        "contact",
        "footer",
        "pricing",
      ];
      if (!validPageIds.includes(pageId)) {
        return errorResponse("Invalid page ID", 400);
      }

      const page = pageStorage.getByPageId(pageId);

      if (!page) {
        return notFoundResponse("Page content");
      }

      console.log(`[Public API] Retrieved page from file storage: ${pageId}`);
      const response = successResponse(page);
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      return response;
    } else {
      // Get all pages
      const pages = pageStorage.getAll();
      console.log("[Public API] Retrieved all pages from file storage");
      const response = successResponse(pages);
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      return response;
    }
  } catch (error) {
    console.error("[Public Page List Error]", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to get page content",
      500,
    );
  }
}
