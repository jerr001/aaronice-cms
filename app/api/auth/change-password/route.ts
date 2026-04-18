/**
 * Change Password API endpoint (Authenticated)
 * POST /api/auth/change-password
 * Headers: Authorization: Bearer <token>
 * Body: { currentPassword, newPassword, confirmPassword }
 * Requires valid JWT token
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUserRepository } from "@/lib/db/index";
import { verifyJWT } from "@/lib/auth/jwt";
import { comparePassword } from "@/lib/auth/crypto";
import {
  errorResponse,
  validationErrorResponse,
  successResponse,
} from "@/lib/utils/response";

const ChangePasswordValidator = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    // Get and verify JWT token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(
        "Missing or invalid authorization header",
        401,
        "NO_AUTH",
      );
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      return errorResponse("Invalid or expired token", 401, "INVALID_TOKEN");
    }

    const body = await request.json();

    // Validate input
    const validation = ChangePasswordValidator.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { currentPassword, newPassword } = validation.data;

    // Get user repository
    const userRepo = await getAdminUserRepository();

    // Get user by ID (decoded.sub is user ID)
    const userWithPassword = await userRepo.getByEmailWithPassword(
      decoded.email,
    );
    if (!userWithPassword) {
      return errorResponse("User not found", 404, "USER_NOT_FOUND");
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      userWithPassword.password,
    );
    if (!isCurrentPasswordValid) {
      return errorResponse(
        "Current password is incorrect",
        400,
        "INVALID_PASSWORD",
      );
    }

    // Change password
    const success = await userRepo.changePassword(
      userWithPassword._id!,
      newPassword,
    );

    if (!success) {
      return errorResponse("Failed to update password", 500, "UPDATE_FAILED");
    }

    return successResponse({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return errorResponse(
      "An error occurred. Please try again.",
      500,
      "INTERNAL_ERROR",
    );
  }
}
