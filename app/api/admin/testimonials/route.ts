/**
 * Admin Testimonials API - Collection Route
 * GET: Fetch all testimonials
 * POST: Create new testimonial
 */

import { Testimonial } from "@/types/testimonial-admin";
import {
  getTestimonialsStorage,
  ensureTestimonialsStoreReady,
} from "@/lib/testimonials-storage";
import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";

export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    // Ensure storage is loaded from disk first
    await ensureTestimonialsStoreReady();
    const storage = getTestimonialsStorage();
    return NextResponse.json({
      ok: true,
      data: storage.getAll(),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch testimonials" },
      { status: 500 },
    );
  }
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    // Ensure storage is loaded from disk first
    await ensureTestimonialsStoreReady();

    const body = await request.json();

    // Validate required fields
    const { author, company, role, content } = body;

    if (
      !author?.trim() ||
      !company?.trim() ||
      !role?.trim() ||
      !content?.trim()
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Author, company, role, and content are required",
        },
        { status: 400 },
      );
    }

    const testimonial: Testimonial = {
      id: Date.now().toString(),
      author: author.trim(),
      company: company.trim(),
      role: role.trim(),
      content: content.trim(),
      image: body.image?.trim() || undefined,
      featured: body.featured || false,
      createdAt: new Date().toISOString(),
    };

    const storage = getTestimonialsStorage();
    storage.add(testimonial);

    return NextResponse.json({ ok: true, data: testimonial }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to create testimonial" },
      { status: 500 },
    );
  }
});
