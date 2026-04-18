/**
 * File-based Courses Storage
 * Provides persistent storage for courses
 */

import { promises as fs } from "fs";
import path from "path";
import { Course } from "@/types/course";

const DATA_DIR = path.join(process.cwd(), "data");
const COURSES_FILE = path.join(DATA_DIR, "courses.json");

interface CoursesStorage {
  courses: Map<string, Course>;
  add: (data: Course) => Course;
  getAll: () => Course[];
  getById: (id: string | number) => Course | null;
  update: (id: string | number, data: Partial<Course>) => Course;
  delete: (id: string | number) => boolean;
  save: () => Promise<void>;
}

let storage: CoursesStorage | null = null;
export let coursesStoreReady = false;
let diskLoadPromise: Promise<Map<string, Course>> | null = null;

/**
 * Load courses from disk
 */
async function loadCoursesFromDisk(): Promise<Map<string, Course>> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
      const data = await fs.readFile(COURSES_FILE, "utf-8");
      const courses = JSON.parse(data);
      const coursesMap = new Map<string, Course>();

      for (const course of courses) {
        coursesMap.set(String(course.id), course);
      }

      console.log(
        `[CoursesStorage] Loaded ${courses.length} courses from disk`,
      );
      return coursesMap;
    } catch (fileError) {
      if ((fileError as any).code !== "ENOENT") {
        throw fileError;
      }
    }
  } catch (error) {
    console.error("[CoursesStorage] Error loading courses from disk:", error);
  }

  return new Map();
}

/**
 * Get or initialize courses storage
 */
export function getCoursesStorage(): CoursesStorage {
  if (storage) {
    return storage;
  }

  // If this is the first time, start loading from disk
  if (!diskLoadPromise && typeof window === "undefined") {
    diskLoadPromise = loadCoursesFromDisk();
  }

  const courses = new Map<string, Course>();

  // If we have a disk load in progress, wait for it and populate (best effort)
  if (diskLoadPromise && typeof window === "undefined") {
    diskLoadPromise
      .then((coursesFromDisk) => {
        for (const [id, course] of coursesFromDisk) {
          courses.set(id, course);
        }
      })
      .catch((err) => {
        console.error("[CoursesStorage] Error loading from disk:", err);
      });
  }

  storage = {
    courses,

    add(data: Course): Course {
      const id = String(data.id || Date.now());
      const course: Course = {
        ...data,
        id: isNaN(Number(id)) ? data.id : Number(id),
      };
      courses.set(id, course);
      saveCoursesToDisk(courses).catch((err) =>
        console.error("[CoursesStorage] Error saving to disk:", err),
      );
      return course;
    },

    getAll(): Course[] {
      return Array.from(courses.values()).sort((a, b) => {
        const aNum = typeof a.id === "number" ? a.id : parseInt(String(a.id));
        const bNum = typeof b.id === "number" ? b.id : parseInt(String(b.id));
        return aNum - bNum;
      });
    },

    getById(id: string | number): Course | null {
      return courses.get(String(id)) || null;
    },

    update(id: string | number, data: Partial<Course>): Course {
      const idStr = String(id);
      const existing = courses.get(idStr) || ({ id } as Course);
      const updated: Course = {
        ...existing,
        ...data,
        id: existing.id,
      };
      courses.set(idStr, updated);
      saveCoursesToDisk(courses).catch((err) =>
        console.error("[CoursesStorage] Error saving to disk:", err),
      );
      return updated;
    },

    delete(id: string | number): boolean {
      const idStr = String(id);
      const deleted = courses.delete(idStr);
      if (deleted) {
        saveCoursesToDisk(courses).catch((err) =>
          console.error("[CoursesStorage] Error saving to disk:", err),
        );
      }
      return deleted;
    },

    async save(): Promise<void> {
      await saveCoursesToDisk(courses);
    },
  };

  return storage;
}

/**
 * Save courses to disk
 */
async function saveCoursesToDisk(courses: Map<string, Course>): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const coursesArray = Array.from(courses.values());
    await fs.writeFile(
      COURSES_FILE,
      JSON.stringify(coursesArray, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error("[CoursesStorage] Error saving courses to disk:", error);
    throw error;
  }
}

/**
 * Wait for courses storage to be ready and ensure disk data is loaded
 */
export async function ensureCoursesStoreReady(timeout = 5000): Promise<void> {
  const startTime = Date.now();

  // If disk load is in progress, wait for it
  if (diskLoadPromise && typeof window === "undefined") {
    try {
      const coursesFromDisk = await Promise.race([
        diskLoadPromise,
        new Promise<Map<string, Course>>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeout),
        ),
      ]);
      const storage = getCoursesStorage();
      for (const [id, course] of coursesFromDisk) {
        if (!storage.courses.has(id)) {
          storage.courses.set(id, course);
        }
      }
    } catch (error) {
      console.error("[CoursesStorage] Error ensuring ready:", error);
    }
  }

  while (!coursesStoreReady && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  if (!coursesStoreReady) {
    console.warn(
      "[CoursesStorage] Timeout waiting for courses storage to be ready",
    );
  }
}

/**
 * Wait for courses storage to be ready
 */
export async function waitForCoursesStoreReady(timeout = 5000): Promise<void> {
  const startTime = Date.now();
  while (!coursesStoreReady && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  if (!coursesStoreReady) {
    console.warn(
      "[CoursesStorage] Timeout waiting for courses storage to be ready",
    );
  }
}

/**
 * Initialize courses storage (load from disk)
 */
export async function initializeCoursesStorage(): Promise<void> {
  try {
    console.log("[CoursesStorage] Initializing...");
    const courses = await loadCoursesFromDisk();
    const storage = getCoursesStorage();

    for (const [id, course] of courses) {
      storage.courses.set(id, course);
    }

    coursesStoreReady = true;
    console.log(`[CoursesStorage] Initialized with ${courses.size} courses`);
  } catch (error) {
    console.error("[CoursesStorage] Failed to initialize:", error);
    coursesStoreReady = true;
  }
}

// Initialize on import
if (typeof window === "undefined") {
  initializeCoursesStorage().catch(console.error);
}
