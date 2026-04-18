/**
 * Admin Blog CRUD API
 * POST /api/admin/blog - Create new blog post
 * GET /api/admin/blog - List all blog posts (paginated)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  CreateBlogPostValidator,
  PaginationValidator,
} from "@/lib/validators/blog";
import { getBlogRepository } from "@/lib/db/index";
import { withAdminAuth } from "@/lib/auth/middleware";
import {
  errorResponse,
  validationErrorResponse,
  paginatedResponse,
  successResponse,
} from "@/lib/utils/response";

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate input
    const validation = CreateBlogPostValidator.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const blogRepo = await getBlogRepository();
    const post = await blogRepo.create(validation.data);

    return successResponse(post, "Blog post created successfully", 201);
  } catch (error) {
    console.error("[Blog Create Error]", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to create blog post",
      500,
    );
  }
});

export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    // Get pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = (searchParams.get("status") || undefined) as
      | "draft"
      | "published"
      | undefined;

    // Validate pagination
    const paginationData = PaginationValidator.parse({ page, limit });

    console.log("[Blog API] Attempting to connect to MongoDB...");
    const blogRepo = await getBlogRepository();
    console.log("[Blog API] Connected successfully, querying posts...");

    const result = await blogRepo.listAll(
      paginationData.page,
      paginationData.limit,
      status,
    );

    console.log("[Blog API] Query successful, returning results");
    return paginatedResponse(
      result.posts,
      result.total,
      paginationData.page,
      paginationData.limit,
    );
  } catch (error) {
    console.error("[Blog API] Detailed Error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
    });
    return errorResponse(
      error instanceof Error ? error.message : "Failed to list blog posts",
      500,
    );
  }
});
