/**
 * Blog Search API (Admin & Public)
 * GET /api/public/blog/search?q=keyword - Search published blog posts
 */

import { NextRequest } from "next/server";
import { getBlogRepository } from "@/lib/db/index";
import { successResponse, errorResponse } from "@/lib/utils/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.length < 2) {
      return errorResponse("Search query must be at least 2 characters", 400);
    }

    const blogRepo = await getBlogRepository();
    const posts = await blogRepo.search(query, limit);

    return successResponse({
      query,
      results: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error("[Blog Search Error]", error);
    return errorResponse(
      error instanceof Error ? error.message : "Search failed",
      500,
    );
  }
}
