/**
 * Test endpoint to check waitlist storage state
 */

import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";
import { getWaitlistStorage } from "@/lib/waitlist-storage";

export const GET = withAdminAuth(async () => {
  try {
    console.log("[Waitlist Test] GET called");
    const glob = global as typeof globalThis & {
      waitlistStore?: any;
      waitlistStoreReady?: boolean;
    };

    console.log(
      "[Waitlist Test] Global waitlistStore:",
      glob.waitlistStore ? "EXISTS" : "NOT FOUND",
    );
    console.log(
      "[Waitlist Test] Global waitlistStoreReady:",
      glob.waitlistStoreReady,
    );

    const storage = getWaitlistStorage();
    console.log(
      "[Waitlist Test] Storage submissions count:",
      storage.submissions.size,
    );
    console.log(
      "[Waitlist Test] Storage submissions:",
      Array.from(storage.submissions.entries()),
    );

    const allSubmissions = storage.getAll();
    console.log("[Waitlist Test] getAll() returned:", allSubmissions);

    return NextResponse.json({
      success: true,
      globalState: {
        storeExists: !!glob.waitlistStore,
        storeReady: glob.waitlistStoreReady,
      },
      storageState: {
        submissionsCount: storage.submissions.size,
        submissions: allSubmissions,
      },
    });
  } catch (error) {
    console.error("[Waitlist Test] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
});
