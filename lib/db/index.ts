/**
 * Database helper functions
 * Provides easy access to MongoDB connection and repositoriesfor API routes
 */

import clientPromise from "@/lib/mongodb";
import { BlogRepository } from "@/lib/db/blog";
import { PageContentRepository } from "@/lib/db/pages";
import { AdminUserRepository } from "@/lib/db/users";

let cachedDb: any = null;
let mongodbAvailable = true;

/**
 * Get MongoDB database instance
 * Falls back to in-memory storage if connection fails
 */
export async function getDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    console.log("[Database] Connecting to MongoDB...");
    const client = await clientPromise;
    console.log("[Database] Client connected successfully");
    const db = client.db(process.env.MONGODB_DB_NAME || "aaronice");
    console.log(
      "[Database] Got database instance for:",
      process.env.MONGODB_DB_NAME || "aaronice",
    );
    cachedDb = db;
    mongodbAvailable = true;
    return db;
  } catch (error: any) {
    console.error("[Database] Error connecting to MongoDB:", {
      message: error?.message,
      code: error?.code,
      type: error?.constructor?.name,
    });
    mongodbAvailable = false;
    // Return null to signal fallback storage should be used
    return null;
  }
}

/**
 * Get blog repository (with fallback to in-memory storage)
 */
export async function getBlogRepository(): Promise<BlogRepository | any> {
  const db = await getDatabase();

  if (!db) {
    // MongoDB is unavailable - use simple in-memory fallback
    console.log("[Repository] Using in-memory blog storage");

    const { getBlogStorage } = await import("@/lib/blog-storage");
    const storage = getBlogStorage();

    return {
      _isFallback: true,
      create: async (data: any) => {
        const id = Math.random().toString(36).substr(2, 9);
        console.log("[Fallback] Creating post with ID:", id);
        console.log("[Fallback] Create data keys:", Object.keys(data));

        const post = {
          _id: id,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          featuredImage: data.featuredImage,
          category: data.category || "",
          status: data.status || "draft",
          author: data.authorName || "Unknown",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log("[Fallback] Calling storage.create...");
        storage.create(post);

        // Verify it was created
        const verified = storage.getById(id);
        console.log(
          "[Fallback] Post creation verified:",
          verified ? "YES - found in storage" : "NO - NOT in storage!",
        );

        if (!verified) {
          console.error("[Fallback] CRITICAL: Post was not actually stored!");
          const allPosts = storage.getAll();
          console.error("[Fallback] Total posts now:", allPosts.length);
          console.error(
            "[Fallback] All IDs:",
            allPosts.map((p) => p._id),
          );
        }

        return post;
      },
      getById: async (id: string) => {
        const result = storage.getById(id);
        console.log(
          "[Fallback] getById",
          id,
          ":",
          result ? "FOUND" : "NOT FOUND",
        );
        if (!result) {
          const allPosts = storage.getAll();
          console.log("[Fallback] Available posts:", allPosts.length);
          console.log(
            "[Fallback] Available IDs:",
            allPosts.map((p) => p._id),
          );
        }
        return result;
      },
      getBySlug: async (slug: string) => storage.getBySlug(slug),
      listAll: async (page = 1, limit = 10, status?: string) => {
        const allPosts = storage.getAll();
        const filtered = status
          ? allPosts.filter((p) => p.status === status)
          : allPosts;
        const skip = (page - 1) * limit;
        return {
          posts: filtered.slice(skip, skip + limit),
          total: filtered.length,
          pages: Math.ceil(filtered.length / limit),
        };
      },
      listPublished: async (page = 1, limit = 10) => {
        const posts = storage.getAll().filter((p) => p.status === "published");
        const skip = (page - 1) * limit;
        return {
          posts: posts.slice(skip, skip + limit),
          total: posts.length,
          pages: Math.ceil(posts.length / limit),
        };
      },
      search: async (query: string, limit = 10) =>
        storage.search(query).slice(0, limit),
      update: async (id: string, data: any) => {
        console.log("[Fallback] Update request for ID:", id);
        console.log("[Fallback] Update data keys:", Object.keys(data));

        const existing = storage.getById(id);
        if (!existing) {
          const allPosts = storage.getAll();
          console.error("[Fallback] Post not found - ID:", id);
          console.error("[Fallback] Available posts:", allPosts.length);
          console.error(
            "[Fallback] Available IDs:",
            allPosts.map((p) => p._id),
          );
          throw new Error(`Post ${id} not found`);
        }

        console.log("[Fallback] Found existing post:", existing._id);

        // Merge all data into update
        const updateData: any = {
          title: data.title !== undefined ? data.title : existing.title,
          slug: data.slug !== undefined ? data.slug : existing.slug,
          excerpt: data.excerpt !== undefined ? data.excerpt : existing.excerpt,
          content: data.content !== undefined ? data.content : existing.content,
          category:
            data.category !== undefined ? data.category : existing.category,
          status: data.status !== undefined ? data.status : existing.status,
          author:
            data.authorName !== undefined ? data.authorName : existing.author,
          featuredImage:
            data.featuredImage !== undefined
              ? data.featuredImage
              : existing.featuredImage,
        };

        console.log(
          "[Fallback] Calling storage.update with:",
          Object.keys(updateData),
        );
        const updated = storage.update(id, updateData);

        console.log(
          "[Fallback] storage.update returned:",
          updated ? "SUCCESS" : "NULL",
        );
        if (!updated) {
          console.error("[Fallback] storage.update returned null/undefined");
          throw new Error(`Failed to update post ${id}`);
        }

        console.log("[Fallback] Update complete for ID:", id);
        return updated;
      },
      delete: async (id: string) => storage.delete(id),
    };
  }

  return new BlogRepository(db);
}

/**
 * Get page content repository
 */
export async function getPageContentRepository(): Promise<PageContentRepository> {
  const db = await getDatabase();

  if (!db) {
    console.log(
      "[Repository] Page content requires MongoDB - not available in fallback mode",
    );
    throw new Error(
      "Page content repository requires MongoDB connection. MongoDB is currently unavailable.",
    );
  }

  return new PageContentRepository(db);
}

/**
 * Get admin user repository
 */
export async function getAdminUserRepository(): Promise<AdminUserRepository> {
  const db = await getDatabase();

  if (!db) {
    console.log(
      "[Repository] Admin users require MongoDB - not available in fallback mode",
    );
    throw new Error(
      "Admin user repository requires MongoDB connection. MongoDB is currently unavailable.",
    );
  }

  return new AdminUserRepository(db);
}
