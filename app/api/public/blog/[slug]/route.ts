/**
 * Public Blog Detail API
 * GET /api/public/blog/[slug] - Get published blog post by slug
 */

import { NextRequest } from "next/server";
import { getBlogRepository } from "@/lib/db/index";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/utils/response";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;

    const blogRepo = await getBlogRepository();
    const post = await blogRepo.getBySlug(slug);

    if (!post || post.status !== "published") {
      return notFoundResponse("Blog post");
    }

    // Get related posts
    const relatedPosts = await blogRepo.getRelated(post._id!, 3);

    return successResponse({
      post,
      relatedPosts,
    });
  } catch (error) {
    console.error("[Public Blog Detail Error]", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to get blog post",
      500,
    );
  }
}
