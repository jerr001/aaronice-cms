/**
 * Admin Testimonials API - Detail Route
 * PUT: Update testimonial
 * DELETE: Delete testimonial
 */

import { Testimonial } from "@/types/testimonial-admin";
import {
  getTestimonialsStorage,
  ensureTestimonialsStoreReady,
} from "@/lib/testimonials-storage";
import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";

export const PUT = withAdminAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      // Ensure storage is loaded from disk first
      await ensureTestimonialsStoreReady();

      const { id } = params;
      const body = await request.json();

      const { author, company, role, content, featured, image } = body;

      // Validate required fields
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

      // Find and update testimonial
      const storage = getTestimonialsStorage();
      const existing = storage.getById(id);

      if (!existing) {
        return NextResponse.json(
          { ok: false, error: "Testimonial not found" },
          { status: 404 },
        );
      }

      const updated: Testimonial = {
        ...existing,
        author: author.trim(),
        company: company.trim(),
        role: role.trim(),
        content: content.trim(),
        image: image?.trim() || undefined,
        featured: featured || false,
      };

      storage.update(id, updated);

      return NextResponse.json({
        ok: true,
        data: updated,
      });
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: "Failed to update testimonial" },
        { status: 500 },
      );
    }
  },
);

export const DELETE = withAdminAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      // Ensure storage is loaded from disk first
      await ensureTestimonialsStoreReady();

      const { id } = params;

      const storage = getTestimonialsStorage();
      const existing = storage.getById(id);

      if (!existing) {
        return NextResponse.json(
          { ok: false, error: "Testimonial not found" },
          { status: 404 },
        );
      }

      storage.delete(id);

      return NextResponse.json({
        ok: true,
        data: existing,
      });
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: "Failed to delete testimonial" },
        { status: 500 },
      );
    }
  },
);
