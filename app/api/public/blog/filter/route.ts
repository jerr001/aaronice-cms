/**
 * Blog Category & Tag Filtering API
 * GET /api/public/blog/category/[category] - Get posts by category
 * GET /api/public/blog/tag/[tag] - Get posts by tag
 */

import { NextRequest } from "next/server";
import { PaginationValidator } from "@/lib/validators/blog";
import { getBlogRepository } from "@/lib/db/index";
import { paginatedResponse, errorResponse } from "@/lib/utils/response";

export async function GET(
  request: NextRequest,
  { params }: { params: { category?: string; tag?: string } },
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Validate pagination
    const paginationData = PaginationValidator.parse({ page, limit });

    const blogRepo = await getBlogRepository();
    let result;

    if (params.category) {
      result = await blogRepo.getByCategory(
        params.category,
        paginationData.page,
        paginationData.limit,
      );
    } else if (params.tag) {
      result = await blogRepo.getByTag(
        params.tag,
        paginationData.page,
        paginationData.limit,
      );
    } else {
      return errorResponse("Invalid request", 400);
    }

    return paginatedResponse(
      result.posts,
      result.total,
      paginationData.page,
      paginationData.limit,
    );
  } catch (error) {
    console.error("[Blog Filter Error]", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to filter posts",
      500,
    );
  }
}
