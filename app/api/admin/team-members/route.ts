/**
 * Admin Team Members API - Collection Route
 * GET: Fetch all team members
 * POST: Create new team member
 */

import { TeamMember } from "@/types/team-member";
import {
  getTeamMembersStorage,
  ensureTeamMembersStoreReady,
} from "@/lib/team-members-storage";
import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";

export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    // Ensure storage is loaded from disk first
    await ensureTeamMembersStoreReady();
    const storage = getTeamMembersStorage();
    return NextResponse.json({
      ok: true,
      data: storage.getAll(),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch team members" },
      { status: 500 },
    );
  }
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    // Ensure storage is loaded from disk first
    await ensureTeamMembersStoreReady();

    const body = await request.json();

    // Validate required fields
    const { name, title, bio } = body;

    if (!name?.trim() || !title?.trim() || !bio?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name, title, and bio are required" },
        { status: 400 },
      );
    }

    const teamMember: TeamMember = {
      id: Date.now().toString(),
      name: name.trim(),
      title: title.trim(),
      bio: bio.trim(),
      image: body.image?.trim() || undefined,
      email: body.email?.trim() || undefined,
      phone: body.phone?.trim() || undefined,
      twitter: body.twitter?.trim() || undefined,
      linkedin: body.linkedin?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const storage = getTeamMembersStorage();
    storage.add(teamMember);

    return NextResponse.json({ ok: true, data: teamMember }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to create team member" },
      { status: 500 },
    );
  }
});
