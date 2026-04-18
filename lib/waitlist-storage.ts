/**
 * File-based persistent waitlist storage
 * Submissions are saved to disk and survive server restarts
 */

import { promises as fs } from "fs";
import path from "path";

interface WaitlistSubmission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  paymentOption?: string;
  totalAmount?: number;
  paymentAmount?: number;
  createdAt: string; // ISO string for persistence
}

interface WaitlistStorage {
  submissions: Map<string, WaitlistSubmission>;
  getAll(): WaitlistSubmission[];
  add(
    submission: Omit<WaitlistSubmission, "_id" | "createdAt">,
  ): WaitlistSubmission;
  getById(id: string): WaitlistSubmission | undefined;
  getByEmail(email: string): WaitlistSubmission[];
  delete(id: string): boolean;
  save(): Promise<void>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist-submissions.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("[WaitlistStorage] Error creating data directory:", error);
  }
}

async function loadWaitlistFromDisk(): Promise<
  Map<string, WaitlistSubmission>
> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(WAITLIST_FILE, "utf-8");
    const submissions = JSON.parse(data) as Record<string, WaitlistSubmission>;
    const map = new Map(Object.entries(submissions));
    console.log(`[WaitlistStorage] Loaded ${map.size} submissions from disk`);
    return map;
  } catch (error) {
    console.log(
      "[WaitlistStorage] No existing submissions file, starting fresh",
    );
    return new Map();
  }
}

function createWaitlistStorage(): WaitlistStorage {
  const storage: WaitlistStorage = {
    submissions: new Map(),

    getAll() {
      return Array.from(this.submissions.values()).sort(
        (a: WaitlistSubmission, b: WaitlistSubmission) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) as WaitlistSubmission[];
    },

    add(data) {
      const id = Math.random().toString(36).substr(2, 9);
      const submission: WaitlistSubmission = {
        _id: id,
        ...data,
        createdAt: new Date().toISOString(),
      };
      this.submissions.set(id, submission);
      console.log("[WaitlistStorage] Added submission:", id);
      this.save().catch((error) =>
        console.error("[WaitlistStorage] Error saving to disk:", error),
      );
      return submission;
    },

    getById(id: string) {
      return this.submissions.get(id);
    },

    getByEmail(email: string) {
      return this.getAll().filter((s) => s.email === email);
    },

    delete(id: string) {
      const result = this.submissions.delete(id);
      if (result) {
        this.save().catch((error) =>
          console.error("[WaitlistStorage] Error saving to disk:", error),
        );
      }
      return result;
    },

    async save() {
      try {
        await ensureDataDir();
        const obj = Object.fromEntries(this.submissions);
        await fs.writeFile(WAITLIST_FILE, JSON.stringify(obj, null, 2));
      } catch (error) {
        console.error("[WaitlistStorage] Error saving to disk:", error);
        throw error;
      }
    },
  };

  return storage;
}

export function getWaitlistStorage(): WaitlistStorage {
  let glob = global as typeof globalThis & {
    waitlistStore?: WaitlistStorage;
    waitlistStoreReady?: boolean;
  };

  if (!glob.waitlistStore) {
    console.log("[WaitlistStorage] Creating new waitlist storage");
    glob.waitlistStore = createWaitlistStorage();
    glob.waitlistStoreReady = false;

    // Load from disk asynchronously
    loadWaitlistFromDisk()
      .then((submissions) => {
        if (glob.waitlistStore) {
          glob.waitlistStore.submissions = submissions;
          glob.waitlistStoreReady = true;
          console.log(
            `[WaitlistStorage] Initialized with ${submissions.size} submissions from disk`,
          );
        }
      })
      .catch((error) => {
        console.error("[WaitlistStorage] Error loading from disk:", error);
        glob.waitlistStoreReady = true;
      });
  }

  return glob.waitlistStore;
}

export type { WaitlistSubmission, WaitlistStorage };
