/**
 * File-based persistent contact submission storage
 * Submissions are saved to disk and survive server restarts
 */

import { promises as fs } from "fs";
import path from "path";

interface ContactSubmission {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string; // ISO string for persistence
  read: boolean;
}

interface ContactStorage {
  submissions: Map<string, ContactSubmission>;
  getAll(): ContactSubmission[];
  add(
    submission: Omit<ContactSubmission, "_id" | "createdAt" | "read">,
  ): ContactSubmission;
  getById(id: string): ContactSubmission | undefined;
  markAsRead(id: string): boolean;
  delete(id: string): boolean;
  save(): Promise<void>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const CONTACT_FILE = path.join(DATA_DIR, "contact-submissions.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("[ContactStorage] Error creating data directory:", error);
  }
}

async function loadContactsFromDisk(): Promise<Map<string, ContactSubmission>> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CONTACT_FILE, "utf-8");
    const submissions = JSON.parse(data) as Record<string, ContactSubmission>;
    const map = new Map(Object.entries(submissions));
    console.log(`[ContactStorage] Loaded ${map.size} submissions from disk`);
    return map;
  } catch (error) {
    console.log(
      "[ContactStorage] No existing submissions file, starting fresh",
    );
    return new Map();
  }
}

function createContactStorage(): ContactStorage {
  const storage: ContactStorage = {
    submissions: new Map(),

    getAll() {
      return Array.from(this.submissions.values()).sort(
        (a: ContactSubmission, b: ContactSubmission) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) as ContactSubmission[];
    },

    add(data) {
      const id = Math.random().toString(36).substr(2, 9);
      const submission: ContactSubmission = {
        _id: id,
        ...data,
        createdAt: new Date().toISOString(),
        read: false,
      };
      this.submissions.set(id, submission);
      console.log("[ContactStorage] Added submission:", id);
      this.save().catch((error) =>
        console.error("[ContactStorage] Error saving to disk:", error),
      );
      return submission;
    },

    getById(id: string) {
      return this.submissions.get(id);
    },

    markAsRead(id: string) {
      const submission = this.submissions.get(id);
      if (!submission) return false;
      submission.read = true;
      this.save().catch((error) =>
        console.error("[ContactStorage] Error saving to disk:", error),
      );
      return true;
    },

    delete(id: string) {
      const result = this.submissions.delete(id);
      if (result) {
        this.save().catch((error) =>
          console.error("[ContactStorage] Error saving to disk:", error),
        );
      }
      return result;
    },

    async save() {
      try {
        await ensureDataDir();
        const obj = Object.fromEntries(this.submissions);
        await fs.writeFile(CONTACT_FILE, JSON.stringify(obj, null, 2));
      } catch (error) {
        console.error("[ContactStorage] Error saving to disk:", error);
        throw error;
      }
    },
  };

  return storage;
}

export function getContactStorage(): ContactStorage {
  let glob = global as typeof globalThis & {
    contactStore?: ContactStorage;
    contactStoreReady?: boolean;
  };

  if (!glob.contactStore) {
    console.log("[ContactStorage] Creating new contact storage");
    glob.contactStore = createContactStorage();
    glob.contactStoreReady = false;

    // Load from disk asynchronously
    loadContactsFromDisk()
      .then((submissions) => {
        if (glob.contactStore) {
          glob.contactStore.submissions = submissions;
          glob.contactStoreReady = true;
          console.log(
            `[ContactStorage] Initialized with ${submissions.size} submissions from disk`,
          );
        }
      })
      .catch((error) => {
        console.error("[ContactStorage] Error loading from disk:", error);
        glob.contactStoreReady = true;
      });
  }

  return glob.contactStore;
}

export type { ContactSubmission, ContactStorage };
