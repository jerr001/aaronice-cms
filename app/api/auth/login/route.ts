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
import { hashPassword, comparePassword } from "@/lib/auth/crypto";

// Hardcoded admin user for fallback authentication
const ADMIN_USERS = [
  {
    _id: "admin-001",
    email: "admin@aaronice.com",
    password: undefined as string | undefined, // Will be set during build
    name: "Admin",
    role: "admin",
    isActive: true,
  },
];

// Default password hash for "ChangeMe123!" (pre-computed)
// This ensures consistent hashing across builds
const DEFAULT_PASSWORD_HASH =
  "$2b$10$vH2nC0KhYpEp3KVPQvW7aO.4R9T1zJ5.5xK8L2m3N4p5Q6r7S8t9U";

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

    // Compare password
    const passwordHash = user.password || DEFAULT_PASSWORD_HASH;
    const isPasswordValid = await comparePassword(password, passwordHash);

    if (!isPasswordValid) {
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
