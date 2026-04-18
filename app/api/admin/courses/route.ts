/**
 * Admin Courses API
 * GET: Fetch all courses
 * POST: Create new course
 */

import { Course } from "@/types/course";
import {
  getCoursesStorage,
  ensureCoursesStoreReady,
} from "@/lib/courses-storage";
import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";

export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    // Ensure storage is loaded from disk first
    await ensureCoursesStoreReady();
    const storage = getCoursesStorage();
    return NextResponse.json({
      ok: true,
      data: storage.getAll(),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    // Ensure storage is loaded from disk first
    await ensureCoursesStoreReady();

    const body = await request.json();

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Title is required" },
        { status: 400 },
      );
    }
    if (!body.description?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Description is required" },
        { status: 400 },
      );
    }
    if (!body.duration?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Duration is required" },
        { status: 400 },
      );
    }
    if (!body.price?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Price is required" },
        { status: 400 },
      );
    }
    if (!Array.isArray(body.careers) || body.careers.length === 0) {
      return NextResponse.json(
        { ok: false, error: "At least one career path is required" },
        { status: 400 },
      );
    }

    // Create new course
    const newCourse: Course = {
      id: Date.now(),
      title: body.title,
      description: body.description,
      duration: body.duration,
      price: body.price,
      careers: body.careers,
    };

    const storage = getCoursesStorage();
    storage.add(newCourse);

    return NextResponse.json(
      {
        ok: true,
        data: newCourse,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to create course" },
      { status: 500 },
    );
  }
});
