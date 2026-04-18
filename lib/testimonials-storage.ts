/**
 * File-based Testimonials Storage
 * Provides persistent storage for testimonials
 */

import { promises as fs } from "fs";
import path from "path";
import { Testimonial } from "@/types/testimonial-admin";

const DATA_DIR = path.join(process.cwd(), "data");
const TESTIMONIALS_FILE = path.join(DATA_DIR, "testimonials.json");

interface TestimonialsStorage {
  testimonials: Map<string, Testimonial>;
  add: (data: Testimonial) => Testimonial;
  getAll: () => Testimonial[];
  getById: (id: string) => Testimonial | null;
  update: (id: string, data: Partial<Testimonial>) => Testimonial;
  delete: (id: string) => boolean;
  save: () => Promise<void>;
}

let storage: TestimonialsStorage | null = null;
export let testimonialsStoreReady = false;
let diskLoadPromise: Promise<Map<string, Testimonial>> | null = null;

/**
 * Load testimonials from disk
 */
async function loadTestimonialsFromDisk(): Promise<Map<string, Testimonial>> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
      const data = await fs.readFile(TESTIMONIALS_FILE, "utf-8");
      const testimonials = JSON.parse(data);
      const testimonialMap = new Map<string, Testimonial>();

      for (const testimonial of testimonials) {
        testimonialMap.set(testimonial.id, testimonial);
      }

      console.log(
        `[TestimonialsStorage] Loaded ${testimonials.length} testimonials from disk`,
      );
      return testimonialMap;
    } catch (fileError) {
      if ((fileError as any).code !== "ENOENT") {
        throw fileError;
      }
    }
  } catch (error) {
    console.error(
      "[TestimonialsStorage] Error loading testimonials from disk:",
      error,
    );
  }

  return new Map();
}

/**
 * Get or initialize testimonials storage
 */
export function getTestimonialsStorage(): TestimonialsStorage {
  if (storage) {
    return storage;
  }

  // If this is the first time, start loading from disk
  if (!diskLoadPromise && typeof window === "undefined") {
    diskLoadPromise = loadTestimonialsFromDisk();
  }

  const testimonials = new Map<string, Testimonial>();

  // If we have a disk load in progress, wait for it and populate (best effort)
  if (diskLoadPromise && typeof window === "undefined") {
    diskLoadPromise
      .then((testimonialsFromDisk) => {
        for (const [id, testimonial] of testimonialsFromDisk) {
          testimonials.set(id, testimonial);
        }
      })
      .catch((err) => {
        console.error("[TestimonialsStorage] Error loading from disk:", err);
      });
  }

  storage = {
    testimonials,

    add(data: Testimonial): Testimonial {
      const id = data.id || Date.now().toString();
      const testimonial: Testimonial = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
      };
      testimonials.set(id, testimonial);
      saveTestimonialsToDisk(testimonials).catch((err) =>
        console.error("[TestimonialsStorage] Error saving to disk:", err),
      );
      return testimonial;
    },

    getAll(): Testimonial[] {
      return Array.from(testimonials.values()).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    },

    getById(id: string): Testimonial | null {
      return testimonials.get(id) || null;
    },

    update(id: string, data: Partial<Testimonial>): Testimonial {
      const existing = testimonials.get(id) || ({ id } as Testimonial);
      const updated: Testimonial = {
        ...existing,
        ...data,
        id,
      };
      testimonials.set(id, updated);
      saveTestimonialsToDisk(testimonials).catch((err) =>
        console.error("[TestimonialsStorage] Error saving to disk:", err),
      );
      return updated;
    },

    delete(id: string): boolean {
      const deleted = testimonials.delete(id);
      if (deleted) {
        saveTestimonialsToDisk(testimonials).catch((err) =>
          console.error("[TestimonialsStorage] Error saving to disk:", err),
        );
      }
      return deleted;
    },

    async save(): Promise<void> {
      await saveTestimonialsToDisk(testimonials);
    },
  };

  return storage;
}

/**
 * Save testimonials to disk
 */
async function saveTestimonialsToDisk(
  testimonials: Map<string, Testimonial>,
): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const testimonialsArray = Array.from(testimonials.values());
    await fs.writeFile(
      TESTIMONIALS_FILE,
      JSON.stringify(testimonialsArray, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error(
      "[TestimonialsStorage] Error saving testimonials to disk:",
      error,
    );
    throw error;
  }
}

/**
 * Wait for testimonials storage to be ready and ensure disk data is loaded
 */
export async function ensureTestimonialsStoreReady(
  timeout = 5000,
): Promise<void> {
  const startTime = Date.now();

  // If disk load is in progress, wait for it
  if (diskLoadPromise && typeof window === "undefined") {
    try {
      const testimonialsFromDisk = await Promise.race([
        diskLoadPromise,
        new Promise<Map<string, Testimonial>>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeout),
        ),
      ]);
      const storage = getTestimonialsStorage();
      for (const [id, testimonial] of testimonialsFromDisk) {
        if (!storage.testimonials.has(id)) {
          storage.testimonials.set(id, testimonial);
        }
      }
    } catch (error) {
      console.error("[TestimonialsStorage] Error ensuring ready:", error);
    }
  }

  while (!testimonialsStoreReady && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  if (!testimonialsStoreReady) {
    console.warn(
      "[TestimonialsStorage] Timeout waiting for testimonials storage to be ready",
    );
  }
}

/**
 * Wait for testimonials storage to be ready
 */
export async function waitForTestimonialsStoreReady(
  timeout = 5000,
): Promise<void> {
  const startTime = Date.now();
  while (!testimonialsStoreReady && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  if (!testimonialsStoreReady) {
    console.warn(
      "[TestimonialsStorage] Timeout waiting for testimonials storage to be ready",
    );
  }
}

/**
 * Initialize testimonials storage (load from disk)
 */
export async function initializeTestimonialsStorage(): Promise<void> {
  try {
    console.log("[TestimonialsStorage] Initializing...");
    const testimonials = await loadTestimonialsFromDisk();
    const storage = getTestimonialsStorage();

    for (const [id, testimonial] of testimonials) {
      storage.testimonials.set(id, testimonial);
    }

    testimonialsStoreReady = true;
    console.log(
      `[TestimonialsStorage] Initialized with ${testimonials.size} testimonials`,
    );
  } catch (error) {
    console.error("[TestimonialsStorage] Failed to initialize:", error);
    testimonialsStoreReady = true;
  }
}

// Initialize on import
if (typeof window === "undefined") {
  initializeTestimonialsStorage().catch(console.error);
}
