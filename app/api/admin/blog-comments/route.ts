/**
 * Admin Blog Comments API
 * GET: Get all comments (for admin moderation)
 */

import { BlogComment } from "@/types/blog-engagement";
import { NextRequest, NextResponse } from "next/server";
import { commentsStorage } from "@/lib/comments-storage";

export async function GET(request: NextRequest) {
  try {
    // Get all comments (approved and pending)
    const allComments = commentsStorage.getAll();

    return NextResponse.json({
      ok: true,
      data: allComments,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}
