/**
 * Contact Form Submissions API
 * GET: Fetch all submissions
 * POST: Create new submission
 */

import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";

// Helper to wait for storage to be ready
async function waitForStorageReady(maxWaitMs = 5000) {
  const startTime = Date.now();
  const glob = global as typeof globalThis & {
    contactStoreReady?: boolean;
  };

  while (!glob.contactStoreReady && Date.now() - startTime < maxWaitMs) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

export const GET = withAdminAuth(async () => {
  try {
    // Wait for storage to be ready
    await waitForStorageReady();

    const { getContactStorage } = await import("@/lib/contact-storage");
    const contactStorage = getContactStorage();

    const submissions = contactStorage.getAll().map((sub) => ({
      id: sub._id,
      name: sub.fullName,
      email: sub.email,
      phone: sub.phone,
      subject: sub.subject,
      message: sub.message,
      submittedAt: sub.createdAt,
      read: sub.read,
    }));

    console.log(
      "[Contact Submissions API] Returning",
      submissions.length,
      "submissions",
    );

    return NextResponse.json({
      ok: true,
      data: submissions,
    });
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch submissions",
      },
      { status: 500 },
    );
  }
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.fullName?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name is required" },
        { status: 400 },
      );
    }
    if (!body.email?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 },
      );
    }
    if (!body.message?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Message is required" },
        { status: 400 },
      );
    }

    const { getContactStorage } = await import("@/lib/contact-storage");
    const contactStorage = getContactStorage();

    const submission = contactStorage.add({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      subject: body.subject || "Contact Form Submission",
      message: body.message,
    });

    console.log("[Contact API] New submission created:", submission._id);

    return NextResponse.json({
      ok: true,
      data: submission,
    });
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to save submission",
      },
      { status: 500 },
    );
  }
}
