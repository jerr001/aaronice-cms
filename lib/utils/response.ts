/**
 * Utility functions for standardized API responses and error handling
 */

import { NextResponse } from "next/server";
import { ApiResponse, PaginatedResponse } from "@/types/admin";
import { ZodError } from "zod";

/**
 * Success response
 */
export function successResponse<T>(
  data: T,
  message: string = "Success",
  statusCode: number = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status: statusCode },
  );
}

/**
 * Paginated success response
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  statusCode: number = 200,
): NextResponse<PaginatedResponse<T>> {
  const pages = Math.ceil(total / limit);
  return NextResponse.json(
    {
      data,
      total,
      page,
      limit,
      pages,
    },
    { status: statusCode },
  );
}

/**
 * Error response
 */
export function errorResponse(
  error: string | Error,
  statusCode: number = 400,
  code?: string,
): NextResponse<ApiResponse> {
  const message = error instanceof Error ? error.message : error;
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: code || "ERROR",
    },
    { status: statusCode },
  );
}

/**
 * Validation error response (for Zod errors)
 */
export function validationErrorResponse(
  errors: ZodError,
): NextResponse<ApiResponse> {
  const formatted = errors.issues.map((err) => ({
    field: err.path.join(".") || "root",
    message: err.message,
    code: err.code,
  }));

  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      data: formatted,
    },
    { status: 400 },
  );
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(
  message: string = "Unauthorized",
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: "UNAUTHORIZED",
    },
    { status: 401 },
  );
}

/**
 * Forbidden response
 */
export function forbiddenResponse(
  message: string = "Forbidden",
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: "FORBIDDEN",
    },
    { status: 403 },
  );
}

/**
 * Not found response
 */
export function notFoundResponse(
  resource: string = "Resource",
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: `${resource} not found`,
      code: "NOT_FOUND",
    },
    { status: 404 },
  );
}

/**
 * Conflict response (e.g., duplicate entry)
 */
export function conflictResponse(
  message: string = "Conflict",
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: "CONFLICT",
    },
    { status: 409 },
  );
}

/**
 * Internal server error response
 */
export function serverErrorResponse(error?: Error): NextResponse<ApiResponse> {
  console.error("[API Error]", error);
  return NextResponse.json(
    {
      success: false,
      error: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    },
    { status: 500 },
  );
}
