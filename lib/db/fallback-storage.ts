/**
 * Persistent file-based fallback storage
 * Falls back to JSON file when MongoDB is unavailable
 * This ensures data persists across server restarts during development
 */

import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const STORAGE_DIR = join(process.cwd(), ".fallback-data");
const BLOG_STORAGE_FILE = join(STORAGE_DIR, "blog-posts.json");

export interface BlogPostData {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  authorName: string;
  categories?: string[];
  tags?: string[];
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Initialize storage directory if it doesn't exist
 */
async function ensureStorageDir(): Promise<void> {
  if (!existsSync(STORAGE_DIR)) {
    await mkdir(STORAGE_DIR, { recursive: true });
    console.log("[Fallback Storage] Created storage directory:", STORAGE_DIR);
  }
}

/**
 * Load all blog posts from file
 */
async function loadPosts(): Promise<BlogPostData[]> {
  try {
    await ensureStorageDir();

    if (!existsSync(BLOG_STORAGE_FILE)) {
      console.log(
        "[Fallback Storage] No existing blog posts file, starting fresh",
      );
      return [];
    }

    const data = await readFile(BLOG_STORAGE_FILE, "utf-8");
    const posts = JSON.parse(data) as BlogPostData[];
    console.log(
      "[Fallback Storage] Loaded",
      posts.length,
      "posts from fallback storage",
    );
    return posts;
  } catch (error) {
    console.error("[Fallback Storage] Error loading posts:", error);
    return [];
  }
}

/**
 * Save all blog posts to file
 */
async function savePosts(posts: BlogPostData[]): Promise<void> {
  try {
    await ensureStorageDir();
    const json = JSON.stringify(posts, null, 2);
    console.log("[Fallback Storage] Writing", posts.length, "posts to disk...");
    await writeFile(BLOG_STORAGE_FILE, json);
    console.log(
      "[Fallback Storage] Successfully saved",
      posts.length,
      "posts. File size:",
      json.length,
      "bytes",
    );
  } catch (error) {
    console.error(
      "[Fallback Storage] ERROR saving posts:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
}

/**
 * Get blog post by ID
 */
export async function getPostById(id: string): Promise<BlogPostData | null> {
  try {
    const posts = await loadPosts();
    console.log(
      "[Fallback Storage] getPostById looking for ID:",
      id,
      "from",
      posts.length,
      "total posts",
    );
    console.log(
      "[Fallback Storage] Available post IDs:",
      posts.map((p) => p._id),
    );
    const found = posts.find((p) => p._id === id) || null;
    console.log(
      "[Fallback Storage] getPostById result:",
      found ? "FOUND" : "NOT FOUND",
    );
    return found;
  } catch (error) {
    console.error(
      "[Fallback Storage] Error in getPostById:",
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

/**
 * Get blog post by slug
 */
export async function getPostBySlug(
  slug: string,
): Promise<BlogPostData | null> {
  const posts = await loadPosts();
  return posts.find((p) => p.slug === slug) || null;
}

/**
 * Get all blog posts
 */
export async function getAllPosts(): Promise<BlogPostData[]> {
  return loadPosts();
}

/**
 * Create blog post
 */
export async function createPost(post: BlogPostData): Promise<BlogPostData> {
  try {
    console.log("[Fallback Storage] Creating post with ID:", post._id);
    const posts = await loadPosts();
    console.log(
      "[Fallback Storage] Before create: total posts =",
      posts.length,
    );
    posts.push(post);
    console.log("[Fallback Storage] After push: total posts =", posts.length);
    console.log(
      "[Fallback Storage] Post to save:",
      JSON.stringify(post, null, 2),
    );
    await savePosts(posts);
    console.log(
      "[Fallback Storage] Successfully saved post with ID:",
      post._id,
    );
    return post;
  } catch (error) {
    console.error(
      "[Fallback Storage] Error creating post:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
}

/**
 * Update blog post
 */
export async function updatePost(
  id: string,
  updates: Partial<BlogPostData>,
): Promise<BlogPostData | null> {
  try {
    const posts = await loadPosts();
    console.log("[Fallback Storage] Updating post ID:", id);
    console.log("[Fallback Storage] Total posts in storage:", posts.length);
    console.log(
      "[Fallback Storage] Available IDs:",
      posts.map((p) => p._id),
    );

    const index = posts.findIndex((p) => p._id === id);
    console.log("[Fallback Storage] Found post at index:", index);

    if (index === -1) {
      console.error("[Fallback Storage] Post not found for ID:", id);
      return null;
    }

    console.log("[Fallback Storage] Updating with keys:", Object.keys(updates));

    const updated: BlogPostData = {
      ...posts[index],
      ...updates,
      _id: posts[index]._id, // Don't allow ID changes
      createdAt: posts[index].createdAt, // Don't allow creation date changes
      updatedAt: new Date().toISOString(),
    };

    posts[index] = updated;
    await savePosts(posts);

    console.log(
      "[Fallback Storage] Post updated successfully, returning:",
      updated._id,
    );
    return updated;
  } catch (error) {
    console.error(
      "[Fallback Storage] Error updating post:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
}

/**
 * Delete blog post
 */
export async function deletePost(id: string): Promise<boolean> {
  const posts = await loadPosts();
  const filtered = posts.filter((p) => p._id !== id);

  if (filtered.length === posts.length) {
    return false; // Not found
  }

  await savePosts(filtered);
  return true;
}

/**
 * Get published posts with pagination
 */
export async function getPublishedPosts(
  page: number = 1,
  limit: number = 10,
): Promise<{ posts: BlogPostData[]; total: number; pages: number }> {
  const allPosts = await loadPosts();
  const published = allPosts.filter((p) => p.status === "published");

  const skip = (page - 1) * limit;
  return {
    posts: published.slice(skip, skip + limit),
    total: published.length,
    pages: Math.ceil(published.length / limit),
  };
}

/**
 * Search blog posts
 */
export async function searchPosts(query: string): Promise<BlogPostData[]> {
  const posts = await loadPosts();
  const lowerQuery = query.toLowerCase();

  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.excerpt.toLowerCase().includes(lowerQuery) ||
      p.content.toLowerCase().includes(lowerQuery),
  );
}
