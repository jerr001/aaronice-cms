/**
 * Admin logout endpoint
 * POST /api/auth/logout
 * Clears the admin token cookie
 */

import { NextRequest, NextResponse } from "next/server";
import { successResponse } from "@/lib/utils/response";

export async function POST(request: NextRequest) {
  try {
    const response = successResponse(null, "Logout successful", 200);

    // Clear the admin token cookie
    response.cookies.delete("admin_token");

    return response;
  } catch (error) {
    console.error("[Logout Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Logout failed",
      },
      { status: 500 },
    );
  }
}
