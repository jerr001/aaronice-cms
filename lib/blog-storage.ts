/**
 * In-memory blog storage module
 * Singleton pattern to persist blog posts across requests
 * Uses same approach as comments and likes storage
 *
 * This is a development fallback when MongoDB is unavailable
 */

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  status: "draft" | "published";
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views?: number;
}

interface BlogStorage {
  posts: Map<string, BlogPost>;
  getAll(): BlogPost[];
  getById(id: string): BlogPost | undefined;
  getBySlug(slug: string): BlogPost | undefined;
  create(post: BlogPost): BlogPost;
  update(id: string, updates: Partial<BlogPost>): BlogPost | undefined;
  delete(id: string): boolean;
  search(query: string): BlogPost[];
}

/**
 * Create blog storage instance
 */
function createBlogStorage(): BlogStorage {
  return {
    posts: new Map<string, BlogPost>(),

    getAll() {
      return Array.from(this.posts.values()).sort(
        (a: BlogPost, b: BlogPost) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) as BlogPost[];
    },

    getById(id: string) {
      return this.posts.get(id);
    },

    getBySlug(slug: string) {
      return Array.from(this.posts.values()).find(
        (p: BlogPost) => p.slug === slug,
      ) as BlogPost | undefined;
    },

    create(post: BlogPost) {
      this.posts.set(post._id, post);
      return post;
    },

    update(id: string, updates: Partial<BlogPost>) {
      const existing = this.posts.get(id);
      if (!existing) return undefined;

      const updated = {
        ...existing,
        ...updates,
        _id: existing._id,
        createdAt: existing.createdAt,
        updatedAt: new Date(),
      };

      this.posts.set(id, updated);
      return updated;
    },

    delete(id: string) {
      return this.posts.delete(id);
    },

    search(query: string) {
      const lowerQuery = query.toLowerCase();
      return Array.from(this.posts.values()).filter(
        (p: BlogPost) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.excerpt.toLowerCase().includes(lowerQuery) ||
          p.content.toLowerCase().includes(lowerQuery),
      ) as BlogPost[];
    },
  };
}

/**
 * Get or create global blog storage (singleton)
 */
export function getBlogStorage(): BlogStorage {
  let glob = global as typeof globalThis & {
    blogStore?: BlogStorage;
  };

  if (!glob.blogStore) {
    console.log("[BlogStorage] Creating new singleton blog storage");
    glob.blogStore = createBlogStorage();
  } else {
    console.log(
      "[BlogStorage] Returning existing singleton storage with",
      glob.blogStore.getAll().length,
      "posts",
    );
  }

  return glob.blogStore;
}

export type { BlogPost, BlogStorage };
