/**
 * Admin Team Members API - Detail Route
 * PUT: Update team member
 * DELETE: Delete team member
 */

import { TeamMember } from "@/types/team-member";
import {
  getTeamMembersStorage,
  ensureTeamMembersStoreReady,
} from "@/lib/team-members-storage";
import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";

export const PUT = withAdminAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      // Ensure storage is loaded from disk first
      await ensureTeamMembersStoreReady();

      const { id } = params;
      const body = await request.json();

      const { name, title, bio, image, email, phone, twitter, linkedin } = body;

      // Validate required fields
      if (!name?.trim() || !title?.trim() || !bio?.trim()) {
        return NextResponse.json(
          { ok: false, error: "Name, title, and bio are required" },
          { status: 400 },
        );
      }

      // Find and update team member
      const storage = getTeamMembersStorage();
      const existing = storage.getById(id);

      if (!existing) {
        return NextResponse.json(
          { ok: false, error: "Team member not found" },
          { status: 404 },
        );
      }

      const updated: TeamMember = {
        ...existing,
        name: name.trim(),
        title: title.trim(),
        bio: bio.trim(),
        image: image?.trim() || undefined,
        email: email?.trim() || undefined,
        phone: phone?.trim() || undefined,
        twitter: twitter?.trim() || undefined,
        linkedin: linkedin?.trim() || undefined,
      };

      storage.update(id, updated);

      return NextResponse.json({
        ok: true,
        data: updated,
      });
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: "Failed to update team member" },
        { status: 500 },
      );
    }
  },
);

export const DELETE = withAdminAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      // Ensure storage is loaded from disk first
      await ensureTeamMembersStoreReady();

      const { id } = params;

      const storage = getTeamMembersStorage();
      const existing = storage.getById(id);

      if (!existing) {
        return NextResponse.json(
          { ok: false, error: "Team member not found" },
          { status: 404 },
        );
      }

      storage.delete(id);

      return NextResponse.json({
        ok: true,
        data: existing,
      });
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: "Failed to delete team member" },
        { status: 500 },
      );
    }
  },
);
