/**
 * Centralized in-memory storage for blog likes
 * Singleton pattern to ensure a single instance across all routes
 */

interface PostLikes {
  count: number;
  lastUpdated: string;
}

// Global variable to store likes across module reloads
declare global {
  var likesStore: Map<string, PostLikes> | undefined;
}

// Initialize on first load or reuse existing
if (!global.likesStore) {
  global.likesStore = new Map();
}

export const likesStorage = {
  /**
   * Get like count for a post
   */
  getCount(slug: string): number {
    const store = global.likesStore || new Map();
    const likes = store.get(slug);
    const count = likes?.count || 0;
    console.log(`[Likes] Getting count for "${slug}": ${count}`);
    return count;
  },

  /**
   * Increment like count and return new count
   */
  increment(slug: string): number {
    const store = global.likesStore || new Map();
    const current = store.get(slug);
    const newCount = (current?.count || 0) + 1;

    store.set(slug, {
      count: newCount,
      lastUpdated: new Date().toISOString(),
    });

    global.likesStore = store;
    console.log(`[Likes] Incremented "${slug}" to ${newCount}`);
    return newCount;
  },

  /**
   * Decrement like count and return new count
   */
  decrement(slug: string): number {
    const store = global.likesStore || new Map();
    const current = store.get(slug);
    const newCount = Math.max(0, (current?.count || 1) - 1);

    store.set(slug, {
      count: newCount,
      lastUpdated: new Date().toISOString(),
    });

    global.likesStore = store;
    console.log(`[Likes] Decremented "${slug}" to ${newCount}`);
    return newCount;
  },

  /**
   * Set like count directly
   */
  set(slug: string, count: number): number {
    const store = global.likesStore || new Map();
    const newCount = Math.max(0, count);

    store.set(slug, {
      count: newCount,
      lastUpdated: new Date().toISOString(),
    });

    global.likesStore = store;
    console.log(`[Likes] Set "${slug}" to ${newCount}`);
    return count;
  },

  /**
   * Get all likes
   */
  getAll(): Record<string, PostLikes> {
    const store = global.likesStore || new Map();
    const result: Record<string, PostLikes> = {};
    store.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  },

  /**
   * Clear all likes (for testing)
   */
  clear(): void {
    if (global.likesStore) {
      global.likesStore.clear();
    }
  },

  /**
   * Debug: Get store size
   */
  debug(): Record<string, PostLikes> {
    return likesStorage.getAll();
  },
};
