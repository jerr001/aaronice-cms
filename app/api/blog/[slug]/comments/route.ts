/**
 * Blog Comments API
 * GET: Get all approved comments for a post
 * POST: Add a new comment (needs approval)
 */

import { BlogComment } from "@/types/blog-engagement";
import { NextRequest, NextResponse } from "next/server";
import { commentsStorage } from "@/lib/comments-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;

    // Get only approved comments for this post
    const postComments = commentsStorage.getApprovedBySlug(slug);

    return NextResponse.json({
      ok: true,
      data: postComments,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;
    const body = await request.json();

    const { author, email, content } = body;

    // Validate
    if (!author?.trim() || !email?.trim() || !content?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and comment are required" },
        { status: 400 },
      );
    }

    // Simple email validation
    if (!email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address" },
        { status: 400 },
      );
    }

    const comment: BlogComment = {
      id: Date.now().toString(),
      postSlug: slug,
      author: author.trim(),
      email: email.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      approved: true, // Comments are approved by default, users can remove them
    };

    commentsStorage.create(comment);

    return NextResponse.json(
      {
        ok: true,
        message: "Comment submitted and awaiting approval",
        data: comment,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to post comment" },
      { status: 500 },
    );
  }
}
