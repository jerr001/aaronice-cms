/**
 * Admin Courses Detail API
 * PUT: Update course
 * DELETE: Delete course
 */

import { Course } from "@/types/course";
import {
  getCoursesStorage,
  ensureCoursesStoreReady,
} from "@/lib/courses-storage";
import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";

export const PUT = withAdminAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      // Ensure storage is loaded from disk first
      await ensureCoursesStoreReady();

      const { id } = params;
      const body = await request.json();

      const { title, description, duration, price, careers } = body;

      // Validate required fields
      if (!title?.trim() || !description?.trim()) {
        return NextResponse.json(
          { ok: false, error: "Title and description are required" },
          { status: 400 },
        );
      }

      // Find and update course
      const storage = getCoursesStorage();
      const existing = storage.getById(id);

      if (!existing) {
        return NextResponse.json(
          { ok: false, error: "Course not found" },
          { status: 404 },
        );
      }

      const updated: Course = {
        ...existing,
        title: title.trim(),
        description: description.trim(),
        duration: duration?.trim() || existing.duration,
        price: price?.trim() || existing.price,
        careers: careers || existing.careers,
      };

      storage.update(id, updated);

      return NextResponse.json({
        ok: true,
        data: updated,
      });
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: "Failed to update course" },
        { status: 500 },
      );
    }
  },
);

export const DELETE = withAdminAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      // Ensure storage is loaded from disk first
      await ensureCoursesStoreReady();

      const { id } = params;

      const storage = getCoursesStorage();
      const existing = storage.getById(id);

      if (!existing) {
        return NextResponse.json(
          { ok: false, error: "Course not found" },
          { status: 404 },
        );
      }

      storage.delete(id);

      return NextResponse.json({
        ok: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: "Failed to delete course" },
        { status: 500 },
      );
    }
  },
);
