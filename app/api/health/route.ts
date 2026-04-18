/**
 * Health check endpoint
 * GET /api/health - Check if MongoDB is connected
 */

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("[Health] Checking MongoDB connection...");

    const startTime = Date.now();
    const client = await clientPromise;
    const connectionTime = Date.now() - startTime;

    console.log("[Health] MongoDB connected in", connectionTime, "ms");

    // Try a simple command to verify connection
    const adminDb = client.db("admin");
    const pingResult = await adminDb.command({ ping: 1 });

    console.log("[Health] MongoDB ping successful");

    return NextResponse.json(
      {
        status: "ok",
        mongodb: {
          connected: true,
          connectionTime: `${connectionTime}ms`,
          ping: pingResult,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[Health] Check failed:", {
      message: error?.message,
      code: error?.code,
      type: error?.constructor?.name,
    });

    return NextResponse.json(
      {
        status: "error",
        mongodb: {
          connected: false,
          error: error?.message || "Unknown error",
          code: error?.code || "UNKNOWN",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
