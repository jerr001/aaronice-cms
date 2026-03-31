/**
 * Admin login API endpoint
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { success, token, user }
 */

import { NextRequest, NextResponse } from "next/server";

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

// Simple JWT signing without external dependencies
function signSimpleJWT(payload: Record<string, any>): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  };

  const headerEncoded = Buffer.from(JSON.stringify(header))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const payloadEncoded = Buffer.from(JSON.stringify(tokenPayload))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const signature = require("crypto")
    .createHmac("sha256", process.env.ADMIN_JWT_SECRET || "secret-key")
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Find user in hardcoded list
    const user = ADMIN_USERS.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "User account is inactive",
        },
        { status: 401 }
      );
    }

    // Simple string comparison for fallback auth
    if (password !== user.password) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signSimpleJWT({
      sub: user._id,
      email: user.email,
      role: user.role,
    });

    // Create response with token in httpOnly cookie + body
    const response = NextResponse.json(
      {
        success: true,
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          token,
        },
        message: "Login successful",
      },
      { status: 200 }
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
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      },
      { status: 500 }
    );
  }
}
