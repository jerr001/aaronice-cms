/**
 * File-based Page Storage
 * Provides persistent storage for page content without MongoDB dependency
 */

import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PAGES_FILE = path.join(DATA_DIR, "pages.json");

export interface PageContent {
  pageId: string;
  heroTitle?: string;
  heroSubtitle?: string;
  mainContent?: string;
  title?: string;
  description?: string;
  aboutIntro?: string;
  visionStatement?: string;
  missionStatement?: string;
  heading?: string;
  email?: string;
  phone?: string;
  address?: string;
  intro?: string;
  highlight?: string;
  content?: string;
  footerText?: string;
  socialLinks?: Record<string, string>;
  updatedAt?: string;
}

interface PageStorage {
  pages: Map<string, PageContent>;
  add: (data: PageContent) => PageContent;
  getAll: () => PageContent[];
  getByPageId: (pageId: string) => PageContent | null;
  update: (pageId: string, data: Partial<PageContent>) => PageContent;
  delete: (pageId: string) => boolean;
  save: () => Promise<void>;
}

let storage: PageStorage | null = null;
export let pagesStoreReady = false;

/**
 * Load pages from disk
 */
async function loadPagesFromDisk(): Promise<Map<string, PageContent>> {
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Check if pages file exists
    try {
      const data = await fs.readFile(PAGES_FILE, "utf-8");
      const pages = JSON.parse(data);
      const pagesMap = new Map<string, PageContent>();

      for (const page of pages) {
        pagesMap.set(page.pageId, page);
      }

      console.log(`[PageStorage] Loaded ${pages.length} pages from disk`);
      return pagesMap;
    } catch (fileError) {
      // File doesn't exist yet, that's fine
      if ((fileError as any).code !== "ENOENT") {
        throw fileError;
      }
    }
  } catch (error) {
    console.error("[PageStorage] Error loading pages from disk:", error);
  }

  return new Map();
}

/**
 * Get or initialize page storage
 */
export function getPageStorage(): PageStorage {
  if (storage) {
    return storage;
  }

  const pages = new Map<string, PageContent>();

  storage = {
    pages,

    add(data: PageContent): PageContent {
      const pageId = data.pageId;
      const page: PageContent = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      pages.set(pageId, page);
      // Save to disk asynchronously
      savePagesToDisk(pages).catch((err) =>
        console.error("[PageStorage] Error saving to disk:", err),
      );
      return page;
    },

    getAll(): PageContent[] {
      return Array.from(pages.values()).sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime(),
      );
    },

    getByPageId(pageId: string): PageContent | null {
      return pages.get(pageId) || null;
    },

    update(pageId: string, data: Partial<PageContent>): PageContent {
      const existing = pages.get(pageId) || { pageId };
      const updated: PageContent = {
        ...existing,
        ...data,
        pageId, // Ensure pageId is not changed
        updatedAt: new Date().toISOString(),
      };
      pages.set(pageId, updated);
      // Save to disk asynchronously
      savePagesToDisk(pages).catch((err) =>
        console.error("[PageStorage] Error saving to disk:", err),
      );
      return updated;
    },

    delete(pageId: string): boolean {
      const deleted = pages.delete(pageId);
      if (deleted) {
        // Save to disk asynchronously
        savePagesToDisk(pages).catch((err) =>
          console.error("[PageStorage] Error saving to disk:", err),
        );
      }
      return deleted;
    },

    async save(): Promise<void> {
      await savePagesToDisk(pages);
    },
  };

  return storage;
}

/**
 * Save pages to disk
 */
async function savePagesToDisk(pages: Map<string, PageContent>): Promise<void> {
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });
    const pagesArray = Array.from(pages.values());
    await fs.writeFile(
      PAGES_FILE,
      JSON.stringify(pagesArray, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error("[PageStorage] Error saving pages to disk:", error);
    throw error;
  }
}

/**
 * Wait for page storage to be ready (data loaded from disk)
 */
export async function waitForPagesStoreReady(timeout = 5000): Promise<void> {
  const startTime = Date.now();
  while (!pagesStoreReady && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  if (!pagesStoreReady) {
    console.warn("[PageStorage] Timeout waiting for page storage to be ready");
  }
}

/**
 * Initialize page storage (load from disk)
 * Call this once at server startup
 */
export async function initializePageStorage(): Promise<void> {
  try {
    console.log("[PageStorage] Initializing...");
    const pages = await loadPagesFromDisk();
    const storage = getPageStorage();

    // Populate storage with loaded pages
    for (const [pageId, page] of pages) {
      storage.pages.set(pageId, page);
    }

    pagesStoreReady = true;
    console.log(`[PageStorage] Initialized with ${pages.size} pages`);
  } catch (error) {
    console.error("[PageStorage] Failed to initialize:", error);
    pagesStoreReady = true; // Set to true anyway to allow operations
  }
}

// Initialize on import
if (typeof window === "undefined") {
  // Server-side only
  initializePageStorage().catch(console.error);
}
