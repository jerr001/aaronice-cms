import { initializeApp } from "@/lib/initialization";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await initializeApp();
    return NextResponse.json({ ok: true, message: "App initialized" });
  } catch (error) {
    console.error("Initialization failed:", error);
    return NextResponse.json(
      { ok: false, error: "Initialization failed" },
      { status: 500 },
    );
  }
}
