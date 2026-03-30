/**
 * Admin login API endpoint
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { success, token, user }
 */

import { NextRequest, NextResponse } from "next/server";
import { LoginValidator } from "@/lib/validators/blog";
import { signJWT } from "@/lib/auth/jwt";
import {
  errorResponse,
  validationErrorResponse,
  successResponse,
} from "@/lib/utils/response";

// Hardcoded admin users for fallback authentication (without MongoDB)
const ADMIN_USERS: Array<{
  _id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  isActive: boolean;
}> = [
  {
    _id: "admin-001",
    email: "admin@aaronice.com",
    password: "ChangeMe123!", // Plain password for fallback (should change in production)
    name: "Admin",
    role: "admin",
    isActive: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = LoginValidator.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { email, password } = validation.data;

    // Find user in hardcoded list
    const user = ADMIN_USERS.find((u) => u.email === email);

    if (!user) {
      return errorResponse(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse("User account is inactive", 401, "USER_INACTIVE");
    }

    // Simple string comparison for fallback auth
    if (password !== user.password) {
      return errorResponse(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    // Generate JWT token
    const token = signJWT({
      sub: user._id,
      email: user.email,
      role: user.role,
    });

    // Create response with token in httpOnly cookie + body
    const response = successResponse(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        token,
      },
      "Login successful",
      200,
    );

    // Set httpOnly cookie for security
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[Login Error]", error);
    return errorResponse(
      error instanceof Error ? error.message : "Login failed",
      500,
    );
  }
}
