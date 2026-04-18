/**
 * Centralized in-memory storage for blog comments
 * Singleton pattern to ensure a single instance across all routes
 */

import { BlogComment } from "@/types/blog-engagement";

// Global variable to store comments across module reloads
declare global {
  var commentsStore: BlogComment[] | undefined;
}

// Initialize on first load or reuse existing
if (!global.commentsStore) {
  global.commentsStore = [];
}

export const commentsStorage = {
  /**
   * Get all comments for a post
   */
  getBySlug(slug: string): BlogComment[] {
    return (global.commentsStore || []).filter((c) => c.postSlug === slug);
  },

  /**
   * Get approved comments for a post
   */
  getApprovedBySlug(slug: string): BlogComment[] {
    return (global.commentsStore || [])
      .filter((c) => c.postSlug === slug && c.approved)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  },

  /**
   * Get all comments (admin)
   */
  getAll(): BlogComment[] {
    return (global.commentsStore || []).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  /**
   * Create a new comment
   */
  create(comment: BlogComment): BlogComment {
    if (!global.commentsStore) {
      global.commentsStore = [];
    }
    global.commentsStore.push(comment);
    console.log(
      `[Comments] Created new comment. Total: ${global.commentsStore.length}`,
    );
    return comment;
  },

  /**
   * Find comment by ID
   */
  findById(id: string): BlogComment | undefined {
    return (global.commentsStore || []).find((c) => c.id === id);
  },

  /**
   * Update comment
   */
  update(id: string, updates: Partial<BlogComment>): BlogComment | null {
    if (!global.commentsStore) return null;

    const index = global.commentsStore.findIndex((c) => c.id === id);
    if (index === -1) return null;

    global.commentsStore[index] = {
      ...global.commentsStore[index],
      ...updates,
    };
    console.log(`[Comments] Updated comment ${id}`);
    return global.commentsStore[index];
  },

  /**
   * Delete comment
   */
  delete(id: string): BlogComment | null {
    if (!global.commentsStore) return null;

    const index = global.commentsStore.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const [deleted] = global.commentsStore.splice(index, 1);
    console.log(
      `[Comments] Deleted comment ${id}. Total: ${global.commentsStore.length}`,
    );
    return deleted;
  },

  /**
   * Clear all comments (for testing)
   */
  clear(): void {
    if (global.commentsStore) {
      global.commentsStore = [];
    }
  },

  /**
   * Get total count of comments
   */
  count(): number {
    return (global.commentsStore || []).length;
  },

  /**
   * Debug: Get all comments
   */
  debug(): BlogComment[] {
    return global.commentsStore || [];
  },
};
