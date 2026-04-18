/**
 * TypeScript types for Admin authentication and authorization
 */

import { JWTPayload } from "@/lib/db/models";

export type AdminRole = "admin" | "editor";

/**
 * JWT payload type (same as in models, re-exported for convenience)
 */
export type AuthToken = JWTPayload;

/**
 * Admin session information
 */
export interface AdminSession {
  userId: string;
  email: string;
  role: AdminRole;
  expiresAt: Date;
}

/**
 * Login response from auth endpoint
 */
export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role: AdminRole;
  };
}

/**
 * API response wrapper for consistent error/success handling
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Helper to check if user has required role
 */
export function hasRole(userRole: AdminRole, requiredRole: AdminRole): boolean {
  // Admins have all permissions
  if (userRole === "admin") {
    return true;
  }

  // Editors can only do editor tasks
  return userRole === requiredRole;
}

/**
 * Helper to check if user is admin
 */
export function isAdmin(userRole: AdminRole): boolean {
  return userRole === "admin";
}
