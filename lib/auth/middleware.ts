/**
 * Middleware to protect admin routes
 * Extracts and verifies JWT token from cookies or Authorization header
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth/jwt";
import { JWTPayload } from "@/lib/db/models";
import { unauthorizedResponse } from "@/lib/utils/response";

/**
 * Extract JWT token from request (checks both headers and cookies)
 */
export function extractToken(request: NextRequest): string | null {
  // Check Authorization header first (Bearer token)
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // Check cookies
  const cookieToken = request.cookies.get("admin_token")?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Verify admin token and return payload
 */
export function verifyAdminToken(token: string): JWTPayload | null {
  return verifyJWT(token);
}

/**
 * Middleware to check if request is authenticated
 * Usage: call at start of API route handler
 */
export function withAdminAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    try {
      const token = extractToken(request);

      if (!token) {
        return unauthorizedResponse("Missing authentication token");
      }

      const payload = verifyAdminToken(token);

      if (!payload) {
        return unauthorizedResponse("Invalid or expired token");
      }

      // Attach auth info to request for use in handler
      (request as any).auth = payload;

      return handler(request, context);
    } catch (error) {
      console.error("[Auth Middleware]", error);
      return unauthorizedResponse("Authentication failed");
    }
  };
}

/**
 * Middleware to check if user has specific role
 */
export function withRoleCheck(requiredRole: "admin" | "editor") {
  return (handler: Function) => {
    return async (request: NextRequest, context?: any) => {
      try {
        const token = extractToken(request);

        if (!token) {
          return unauthorizedResponse("Missing authentication token");
        }

        const payload = verifyAdminToken(token);

        if (!payload) {
          return unauthorizedResponse("Invalid or expired token");
        }

        // Check role
        if (requiredRole === "admin" && payload.role !== "admin") {
          return NextResponse.json(
            {
              success: false,
              error: "Admin access required",
              code: "INSUFFICIENT_PERMISSIONS",
            },
            { status: 403 },
          );
        }

        // Attach auth info to request
        (request as any).auth = payload;

        return handler(request, context);
      } catch (error) {
        console.error("[Role Check Middleware]", error);
        return unauthorizedResponse("Authorization check failed");
      }
    };
  };
}

/**
 * Get authenticated user from request
 */
export function getAuthFromRequest(request: any): JWTPayload | null {
  return request.auth || null;
}
