/**
 * Forgot Password API endpoint
 * POST /api/auth/forgot-password
 * Body: { email }
 * Sends password reset link to email
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUserRepository } from "@/lib/db/index";
import { sendEmail } from "@/lib/email";
import {
  errorResponse,
  validationErrorResponse,
  successResponse,
} from "@/lib/utils/response";

const ForgotPasswordValidator = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = ForgotPasswordValidator.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { email } = validation.data;

    // Get user repository
    const userRepo = await getAdminUserRepository();

    // Check if user exists
    const user = await userRepo.getByEmail(email);
    if (!user) {
      // Don't reveal if email exists (security best practice)
      return successResponse({
        message:
          "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = await userRepo.createPasswordResetToken(email);
    if (!resetToken) {
      return errorResponse(
        "Failed to generate reset token",
        500,
        "TOKEN_GENERATION_FAILED",
      );
    }

    // Create reset link
    const resetLink = `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/admin/reset-password?email=${encodeURIComponent(
      email,
    )}&token=${resetToken}`;

    // Send email
    try {
      await sendEmail({
        to: email,
        subject: "Password Reset Request - Aaronice CMS",
        html: `
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the link below to proceed:</p>
          <a href="${resetLink}" style="background-color: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      return errorResponse(
        "Failed to send email. Please try again later.",
        500,
        "EMAIL_SEND_FAILED",
      );
    }

    return successResponse({
      message:
        "If an account exists with this email, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse(
      "An error occurred. Please try again.",
      500,
      "INTERNAL_ERROR",
    );
  }
}
