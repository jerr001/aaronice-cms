/**
 * Contact Submission Detail API
 * PUT: Mark as read
 * DELETE: Delete submission
 */

import { NextRequest, NextResponse } from "next/server";
import { getContactStorage } from "@/lib/contact-storage";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const storage = getContactStorage();
    const submission = storage.getById(params.id);

    if (!submission) {
      return NextResponse.json(
        { ok: false, error: "Submission not found" },
        { status: 404 },
      );
    }

    const marked = storage.markAsRead(params.id);

    if (!marked) {
      return NextResponse.json(
        { ok: false, error: "Failed to mark as read" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      data: submission,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to update submission" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const storage = getContactStorage();
    const deleted = storage.delete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "Submission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("[Contact API] Delete error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete submission" },
      { status: 500 },
    );
  }
}
