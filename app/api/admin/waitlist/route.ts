/**
 * API Route: Admin Waitlist Management
 * GET: Retrieve all waitlist submissions
 * POST: Create waitlist submission (for fallback storage)
 */

import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";
import { getWaitlistStorage } from "@/lib/waitlist-storage";

// Helper to wait for storage to be ready
async function waitForStorageReady(maxWaitMs = 5000) {
  const startTime = Date.now();
  const glob = global as typeof globalThis & {
    waitlistStoreReady?: boolean;
  };

  while (!glob.waitlistStoreReady && Date.now() - startTime < maxWaitMs) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

export const GET = withAdminAuth(async () => {
  try {
    console.log("[Admin Waitlist API] GET called");
    // Wait for storage to be ready
    await waitForStorageReady();
    console.log("[Admin Waitlist API] Storage ready, fetching submissions");

    const storage = getWaitlistStorage();
    console.log(
      "[Admin Waitlist API] Storage has",
      storage.submissions.size,
      "submissions",
    );

    const submissions = storage.getAll().map((sub) => ({
      id: sub._id,
      name: sub.name,
      email: sub.email,
      phone: sub.phone,
      course: sub.course,
      paymentOption: sub.paymentOption,
      totalAmount: sub.totalAmount,
      paymentAmount: sub.paymentAmount,
      createdAt: sub.createdAt,
    }));

    console.log(
      "[Admin Waitlist API] Returning",
      submissions.length,
      "submissions",
    );

    return NextResponse.json({
      success: true,
      data: submissions,
      count: submissions.length,
    });
  } catch (error) {
    console.error("Error fetching waitlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch waitlist" },
      { status: 500 },
    );
  }
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    // Wait for storage to be ready
    await waitForStorageReady();

    const body = await request.json();
    const storage = getWaitlistStorage();
    const submission = storage.add(body);

    return NextResponse.json({
      success: true,
      message: "Waitlist entry added",
      data: submission,
    });
  } catch (error) {
    console.error("Error creating waitlist entry:", error);
    return NextResponse.json(
      { error: "Failed to create waitlist entry" },
      { status: 500 },
    );
  }
});
