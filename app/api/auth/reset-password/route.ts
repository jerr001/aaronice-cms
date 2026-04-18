/**
 * Reset Password API endpoint
 * POST /api/auth/reset-password
 * Body: { email, token, password, confirmPassword }
 * Resets password using valid token
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUserRepository } from "@/lib/db/index";
import {
  errorResponse,
  validationErrorResponse,
  successResponse,
} from "@/lib/utils/response";

const ResetPasswordValidator = z
  .object({
    email: z.string().email("Invalid email address"),
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = ResetPasswordValidator.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { email, token, password } = validation.data;

    // Get user repository
    const userRepo = await getAdminUserRepository();

    // Reset password with token
    const success = await userRepo.resetPasswordWithToken(
      email,
      token,
      password,
    );

    if (!success) {
      return errorResponse(
        "Invalid or expired reset token",
        400,
        "INVALID_TOKEN",
      );
    }

    return successResponse({
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return errorResponse(
      "An error occurred. Please try again.",
      500,
      "INTERNAL_ERROR",
    );
  }
}
