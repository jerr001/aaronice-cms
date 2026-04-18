/**
 * Admin Blog Comment Detail API
 * PUT: Approve a comment
 * DELETE: Delete a comment
 */

import { BlogComment } from "@/types/blog-engagement";
import { NextRequest, NextResponse } from "next/server";
import { commentsStorage } from "@/lib/comments-storage";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { approved } = body;

    const comment = commentsStorage.update(id, { approved });

    if (!comment) {
      return NextResponse.json(
        { ok: false, error: "Comment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      data: comment,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to update comment" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const deleted = commentsStorage.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "Comment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      data: deleted,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
