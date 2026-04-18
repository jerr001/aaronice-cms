/**
 * File-based Team Members Storage
 * Provides persistent storage for team members
 */

import { promises as fs } from "fs";
import path from "path";
import { TeamMember } from "@/types/team-member";

const DATA_DIR = path.join(process.cwd(), "data");
const TEAM_MEMBERS_FILE = path.join(DATA_DIR, "team-members.json");

interface TeamMembersStorage {
  teamMembers: Map<string, TeamMember>;
  add: (data: TeamMember) => TeamMember;
  getAll: () => TeamMember[];
  getById: (id: string) => TeamMember | null;
  update: (id: string, data: Partial<TeamMember>) => TeamMember;
  delete: (id: string) => boolean;
  save: () => Promise<void>;
}

let storage: TeamMembersStorage | null = null;
export let teamMembersStoreReady = false;
let diskLoadPromise: Promise<Map<string, TeamMember>> | null = null;

/**
 * Load team members from disk
 */
async function loadTeamMembersFromDisk(): Promise<Map<string, TeamMember>> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
      const data = await fs.readFile(TEAM_MEMBERS_FILE, "utf-8");
      const teamMembers = JSON.parse(data);
      const teamMembersMap = new Map<string, TeamMember>();

      for (const member of teamMembers) {
        teamMembersMap.set(member.id, member);
      }

      console.log(
        `[TeamMembersStorage] Loaded ${teamMembers.length} team members from disk`,
      );
      return teamMembersMap;
    } catch (fileError) {
      if ((fileError as any).code !== "ENOENT") {
        throw fileError;
      }
    }
  } catch (error) {
    console.error(
      "[TeamMembersStorage] Error loading team members from disk:",
      error,
    );
  }

  return new Map();
}

/**
 * Get or initialize team members storage
 */
export function getTeamMembersStorage(): TeamMembersStorage {
  if (storage) {
    return storage;
  }

  // If this is the first time, start loading from disk
  if (!diskLoadPromise && typeof window === "undefined") {
    diskLoadPromise = loadTeamMembersFromDisk();
  }

  const teamMembers = new Map<string, TeamMember>();

  storage = {
    teamMembers,

    add(data: TeamMember): TeamMember {
      const id = data.id || Date.now().toString();
      const teamMember: TeamMember = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
      };
      teamMembers.set(id, teamMember);
      saveTeamMembersToDisk(teamMembers).catch((err) =>
        console.error("[TeamMembersStorage] Error saving to disk:", err),
      );
      return teamMember;
    },

    getAll(): TeamMember[] {
      return Array.from(teamMembers.values()).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    },

    getById(id: string): TeamMember | null {
      return teamMembers.get(id) || null;
    },

    update(id: string, data: Partial<TeamMember>): TeamMember {
      const existing = teamMembers.get(id) || ({ id } as TeamMember);
      const updated: TeamMember = {
        ...existing,
        ...data,
        id,
      };
      teamMembers.set(id, updated);
      saveTeamMembersToDisk(teamMembers).catch((err) =>
        console.error("[TeamMembersStorage] Error saving to disk:", err),
      );
      return updated;
    },

    delete(id: string): boolean {
      const deleted = teamMembers.delete(id);
      if (deleted) {
        saveTeamMembersToDisk(teamMembers).catch((err) =>
          console.error("[TeamMembersStorage] Error saving to disk:", err),
        );
      }
      return deleted;
    },

    async save(): Promise<void> {
      await saveTeamMembersToDisk(teamMembers);
    },
  };

  // If we have a disk load in progress, wait for it and populate
  if (diskLoadPromise && typeof window === "undefined") {
    diskLoadPromise.then((teamMembersFromDisk) => {
      for (const [id, member] of teamMembersFromDisk) {
        teamMembers.set(id, member);
      }
    }).catch((err) => {
      console.error("[TeamMembersStorage] Error loading from disk:", err);
    });
  }

  return storage;
}

/**
 * Save team members to disk
 */
async function saveTeamMembersToDisk(
  teamMembers: Map<string, TeamMember>,
): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const teamMembersArray = Array.from(teamMembers.values());
    await fs.writeFile(
      TEAM_MEMBERS_FILE,
      JSON.stringify(teamMembersArray, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error(
      "[TeamMembersStorage] Error saving team members to disk:",
      error,
    );
    throw error;
  }
}

/**
 * Wait for team members storage to be ready and ensure disk data is loaded
 */
export async function ensureTeamMembersStoreReady(
  timeout = 5000,
): Promise<void> {
  const startTime = Date.now();
  
  // If disk load is in progress, wait for it
  if (diskLoadPromise && typeof window === "undefined") {
    try {
      const teamMembersFromDisk = await Promise.race([
        diskLoadPromise,
        new Promise<Map<string, TeamMember>>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeout)
        ),
      ]);
      const storage = getTeamMembersStorage();
      for (const [id, member] of teamMembersFromDisk) {
        if (!storage.teamMembers.has(id)) {
          storage.teamMembers.set(id, member);
        }
      }
    } catch (error) {
      console.error("[TeamMembersStorage] Error ensuring ready:", error);
    }
  }
  
  while (!teamMembersStoreReady && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  if (!teamMembersStoreReady) {
    console.warn(
      "[TeamMembersStorage] Timeout waiting for team members storage to be ready",
    );
  }
}

/**
 * Wait for team members storage to be ready
 */
export async function waitForTeamMembersStoreReady(
  timeout = 5000,
): Promise<void> {
  const startTime = Date.now();
  while (!teamMembersStoreReady && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  if (!teamMembersStoreReady) {
    console.warn(
      "[TeamMembersStorage] Timeout waiting for team members storage to be ready",
    );
  }
}

/**
 * Initialize team members storage (load from disk)
 */
export async function initializeTeamMembersStorage(): Promise<void> {
  try {
    console.log("[TeamMembersStorage] Initializing...");
    const teamMembers = await loadTeamMembersFromDisk();
    const storage = getTeamMembersStorage();

    for (const [id, member] of teamMembers) {
      storage.teamMembers.set(id, member);
    }

    teamMembersStoreReady = true;
    console.log(
      `[TeamMembersStorage] Initialized with ${teamMembers.size} team members`,
    );
  } catch (error) {
    console.error("[TeamMembersStorage] Failed to initialize:", error);
    teamMembersStoreReady = true;
  }
}

// Initialize on import
if (typeof window === "undefined") {
  initializeTeamMembersStorage().catch(console.error);
}
