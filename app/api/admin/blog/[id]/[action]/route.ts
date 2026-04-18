/**
 * Admin Blog Publishing API
 * POST /api/admin/blog/[id]/publish - Publish a blog post
 * POST /api/admin/blog/[id]/unpublish - Unpublish a blog post
 */

import { NextRequest } from "next/server";
import { getBlogRepository } from "@/lib/db/index";
import { withAdminAuth } from "@/lib/auth/middleware";
import {
  errorResponse,
  successResponse,
  notFoundResponse,
} from "@/lib/utils/response";

export const POST = withAdminAuth(
  async (
    request: NextRequest,
    { params }: { params: { id: string; action: string } },
  ) => {
    try {
      const { id, action } = params;

      console.log(`[Blog ${action.toUpperCase()}] Starting for post ID:`, id);

      if (!["publish", "unpublish"].includes(action)) {
        return errorResponse("Invalid action", 400);
      }

      const blogRepo = await getBlogRepository();

      // Check if post exists
      const existing = await blogRepo.getById(id);
      if (!existing) {
        console.log(`[Blog ${action.toUpperCase()}] Post not found:`, id);
        return notFoundResponse("Blog post");
      }

      console.log(`[Blog ${action.toUpperCase()}] Found post:`, {
        id,
        title: existing.title,
        currentStatus: existing.status,
      });

      let updated;
      if (action === "publish") {
        console.log(`[Blog PUBLISH] Setting status to 'published'...`);
        updated = await blogRepo.publish(id);
      } else {
        console.log(`[Blog UNPUBLISH] Setting status to 'draft'...`);
        updated = await blogRepo.unpublish(id);
      }

      console.log(`[Blog ${action.toUpperCase()}] Updated post:`, {
        id,
        newStatus: updated?.status,
        publishedAt: updated?.publishedAt,
      });

      return successResponse(updated, `Blog post ${action}ed successfully`);
    } catch (error) {
      console.error(`[Blog ${params.action.toUpperCase()} Error]`, error);
      return errorResponse(
        error instanceof Error
          ? error.message
          : `Failed to ${params.action} blog post`,
        500,
      );
    }
  },
);
