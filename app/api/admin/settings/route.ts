/**
 * Admin Site Settings API
 * GET: Fetch site settings
 * POST: Update site settings
 */

import { SiteSettings } from "@/types/site-settings";
import { NextRequest, NextResponse } from "next/server";

// In-memory storage for site settings (singleton)
let settings: SiteSettings = {
  siteTitle: "Aaronice",
  siteTagline: "Empower Your Skills, Transform Your Future",
  contactEmail: "hello@aaronice.com",
  contactPhone: "+1 (555) 123-4567",
  address: "123 Main Street, City, State 12345",
  businessHours: "Monday - Friday, 9 AM - 5 PM EST",
  twitter: "@aaronice",
  linkedin: "aaronice",
  facebook: "aaronice",
  instagram: "@aaronice",
  youtube: "@aaronice",
  description: "Premium online courses and digital training",
  updatedAt: new Date().toISOString(),
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      ok: true,
      data: settings,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { siteTitle, siteTagline, contactEmail } = body;

    if (!siteTitle?.trim() || !siteTagline?.trim() || !contactEmail?.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Site title, tagline, and contact email are required",
        },
        { status: 400 },
      );
    }

    // Update settings (partial or full)
    settings = {
      siteTitle: siteTitle.trim(),
      siteTagline: siteTagline.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: body.contactPhone?.trim() || undefined,
      address: body.address?.trim() || undefined,
      businessHours: body.businessHours?.trim() || undefined,
      twitter: body.twitter?.trim() || undefined,
      linkedin: body.linkedin?.trim() || undefined,
      facebook: body.facebook?.trim() || undefined,
      instagram: body.instagram?.trim() || undefined,
      youtube: body.youtube?.trim() || undefined,
      description: body.description?.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      ok: true,
      data: settings,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
