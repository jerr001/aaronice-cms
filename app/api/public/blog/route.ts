/**
 * Public Blog API
 * GET /api/public/blog - Get all published blog posts (paginated)
 */

import { NextRequest } from "next/server";
import { PaginationValidator } from "@/lib/validators/blog";
import { getBlogRepository } from "@/lib/db/index";
import { paginatedResponse, errorResponse } from "@/lib/utils/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Validate pagination
    const paginationData = PaginationValidator.parse({ page, limit });

    const blogRepo = await getBlogRepository();
    const result = await blogRepo.listPublished(
      paginationData.page,
      paginationData.limit,
    );

    return paginatedResponse(
      result.posts,
      result.total,
      paginationData.page,
      paginationData.limit,
    );
  } catch (error) {
    console.error("[Public Blog List Error]", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to list blog posts",
      500,
    );
  }
}
