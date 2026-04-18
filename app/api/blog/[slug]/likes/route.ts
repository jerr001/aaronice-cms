/**
 * Blog Likes API
 * GET: Get like count for a post
 * POST: Add a like for a post (client-side tracking via localStorage)
 */

import { BlogLike } from "@/types/blog-engagement";
import { NextRequest, NextResponse } from "next/server";
import { likesStorage } from "@/lib/likes-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;
    const count = likesStorage.getCount(slug);

    return NextResponse.json({
      ok: true,
      data: {
        postSlug: slug,
        count,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch likes" },
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
    const body = await request.json().catch(() => ({}));
    const action = body.action || "increment"; // 'increment' or 'decrement'

    let newCount: number;

    if (action === "decrement") {
      newCount = likesStorage.decrement(slug);
    } else {
      newCount = likesStorage.increment(slug);
    }

    return NextResponse.json({
      ok: true,
      data: {
        postSlug: slug,
        count: newCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to register like" },
      { status: 500 },
    );
  }
}
