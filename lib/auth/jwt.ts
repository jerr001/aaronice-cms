/**
 * JWT utilities for admin authentication
 * Manual JWT implementation using crypto (no external lib needed)
 */

import { createHmac } from "crypto";
import { JWTPayload } from "@/lib/db/models";

const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET || "your-super-secret-jwt-key-change-this";
const JWT_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Base64URL encode
 */
function base64UrlEncode(data: Record<string, any> | string): string {
  const json = typeof data === "string" ? data : JSON.stringify(data);
  return Buffer.from(json)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Base64URL decode
 */
function base64UrlDecode(str: string): string {
  // Add padding if needed
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("Invalid base64url string");
  }
  return Buffer.from(output, "base64").toString("utf-8");
}

/**
 * Sign a JWT token
 */
export function signJWT(payload: Omit<JWTPayload, "iat" | "exp">): string {
  if (!JWT_SECRET || JWT_SECRET === "your-super-secret-jwt-key-change-this") {
    throw new Error("ADMIN_JWT_SECRET is not configured. Set it in .env.local");
  }

  const header = { alg: "HS256", typ: "JWT" };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + JWT_EXPIRY;

  const fullPayload: JWTPayload = {
    ...payload,
    iat,
    exp,
  };

  const headerEncoded = base64UrlEncode(header);
  const payloadEncoded = base64UrlEncode(fullPayload);

  const message = `${headerEncoded}.${payloadEncoded}`;
  const signature = createHmac("sha256", JWT_SECRET)
    .update(message)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${message}.${signature}`;
}

/**
 * Verify a JWT token
 */
export function verifyJWT(token: string): JWTPayload | null {
  if (!JWT_SECRET || JWT_SECRET === "your-super-secret-jwt-key-change-this") {
    throw new Error("ADMIN_JWT_SECRET is not configured");
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const [headerEncoded, payloadEncoded, signatureProvided] = parts;
    const message = `${headerEncoded}.${payloadEncoded}`;

    // Verify signature
    const signatureExpected = createHmac("sha256", JWT_SECRET)
      .update(message)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    // Constant time comparison
    if (signatureProvided !== signatureExpected) {
      return null;
    }

    // Decode and parse payload
    const payloadJson = base64UrlDecode(payloadEncoded);
    const payload: JWTPayload = JSON.parse(payloadJson);

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

/**
 * Decode JWT without verification (use only for debugging)
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson) as JWTPayload;
  } catch {
    return null;
  }
}
