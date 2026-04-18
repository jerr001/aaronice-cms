/**
 * Crypto utilities for password hashing and verification
 * Uses Node.js built-in crypto module with scrypt for secure password handling
 */

import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SALT_LENGTH = 32;
const KEY_LENGTH = 64;
const N = 16384; // CPU/memory cost parameter (scrypt)
const R = 8; // block size parameter
const P = 1; // parallelization parameter

/**
 * Hash a password using scrypt
 * Returns salt + hash concatenated
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(SALT_LENGTH);

    try {
      // Using scryptSync with explicit parameters
      const hash = scryptSync(password, salt as any, KEY_LENGTH, {
        N,
        r: R,
        p: P,
      });
      // Concatenate salt and hash, then encode to base64
      const combined = Buffer.concat([salt, hash as any]);
      const encoded = combined.toString("base64");
      resolve(encoded);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Compare a password with a hash
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      // Decode from base64
      const combined = Buffer.from(hash, "base64");

      // Extract salt and stored hash
      const salt = combined.subarray(0, SALT_LENGTH);
      const storedHash = combined.subarray(SALT_LENGTH);

      // Hash the provided password with the same salt
      const hash2 = scryptSync(password, salt as any, KEY_LENGTH, {
        N,
        r: R,
        p: P,
      });

      // Use timingSafeEqual to prevent timing attacks
      const isMatch = timingSafeEqual(storedHash as any, hash2 as any);
      resolve(isMatch);
    } catch (error) {
      // Return false instead of throwing on mismatch
      if (
        error instanceof Error &&
        error.message.includes("input lengths mismatch")
      ) {
        resolve(false);
      } else {
        reject(error);
      }
    }
  });
}

/**
 * Generate a random token for password reset or verification
 */
export function generateToken(length: number = 32): string {
  return randomBytes(length).toString("hex");
}

/**
 * Generate a secure random string
 */
export function generateSecureString(length: number = 32): string {
  return randomBytes(length).toString("base64").slice(0, length);
}
