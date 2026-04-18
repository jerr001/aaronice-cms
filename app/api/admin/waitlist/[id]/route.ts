/**
 * Waitlist Submission Detail API
 * DELETE: Delete waitlist submission
 */

import { NextRequest, NextResponse } from "next/server";
import { getWaitlistStorage } from "@/lib/waitlist-storage";

// Verify admin token
function verifyAdminToken(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "");
  const expected = process.env.ADMIN_TOKEN || "admin-token-123";

  return token === expected;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Verify admin auth
    if (!verifyAdminToken(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storage = getWaitlistStorage();
    const deleted = storage.delete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("[Waitlist API] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 },
    );
  }
}
