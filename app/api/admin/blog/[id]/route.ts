/**
 * Admin Blog Detail API
 * GET /api/admin/blog/[id] - Get blog post by ID
 * PUT /api/admin/blog/[id] - Update blog post
 * DELETE /api/admin/blog/[id] - Delete blog post
 */

import { NextRequest } from "next/server";
import { UpdateBlogPostValidator } from "@/lib/validators/blog";
import { getBlogRepository } from "@/lib/db/index";
import { withAdminAuth } from "@/lib/auth/middleware";
import {
  errorResponse,
  validationErrorResponse,
  successResponse,
  notFoundResponse,
} from "@/lib/utils/response";

export const GET = withAdminAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const { id } = params;

      const blogRepo = await getBlogRepository();
      const post = await blogRepo.getById(id);

      if (!post) {
        return notFoundResponse("Blog post");
      }

      return successResponse(post);
    } catch (error) {
      console.error("[Blog Get Error]", error);
      return errorResponse(
        error instanceof Error ? error.message : "Failed to get blog post",
        500,
      );
    }
  },
);

export const PUT = withAdminAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const { id } = params;
      console.log("[Blog PUT] Starting update for post ID:", id);

      const body = await request.json();
      console.log("[Blog PUT] Request body received, title:", body.title);

      // Validate input
      const validation = UpdateBlogPostValidator.safeParse(body);
      if (!validation.success) {
        console.error("[Blog PUT] Validation failed:", validation.error);
        return validationErrorResponse(validation.error);
      }

      console.log("[Blog PUT] Validation passed, getting repository...");
      const blogRepo = await getBlogRepository();

      // Check if post exists
      console.log("[Blog PUT] Checking if post exists...");
      const existing = await blogRepo.getById(id);
      if (!existing) {
        console.error("[Blog PUT] Post not found with ID:", id);
        return notFoundResponse("Blog post");
      }

      console.log("[Blog PUT] Updating post...");
      const updated = await blogRepo.update(id, validation.data);
      console.log(
        "[Blog PUT] Update result:",
        updated ? "success" : "null/undefined",
      );
      console.log(
        "[Blog PUT] Updated object type:",
        typeof updated,
        "value:",
        JSON.stringify(updated, null, 2),
      );

      if (!updated) {
        console.error("[Blog PUT] Update returned null/undefined for ID:", id);
        console.error("[Blog PUT] This usually means the post was not found");
        return errorResponse(
          "Failed to update blog post - post was not found or update failed. Check server logs.",
          500,
        );
      }

      console.log("[Blog PUT] Update successful");

      return successResponse(updated, "Blog post updated successfully");
    } catch (error) {
      console.error("[Blog PUT Error]", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        type: error?.constructor?.name,
      });
      return errorResponse(
        error instanceof Error ? error.message : "Failed to update blog post",
        500,
      );
    }
  },
);

export const DELETE = withAdminAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const { id } = params;

      const blogRepo = await getBlogRepository();

      // Check if post exists
      const existing = await blogRepo.getById(id);
      if (!existing) {
        return notFoundResponse("Blog post");
      }

      await blogRepo.delete(id);
      return successResponse(null, "Blog post deleted successfully");
    } catch (error) {
      console.error("[Blog Delete Error]", error);
      return errorResponse(
        error instanceof Error ? error.message : "Failed to delete blog post",
        500,
      );
    }
  },
);
