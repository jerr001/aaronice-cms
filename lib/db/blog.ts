/**
 * Blog post database queries and helpers
 * Uses native MongoDB driver (no ORM)
 */

import { Db, ObjectId, Filter } from "mongodb";
import { BlogPost, BlogPostSchema } from "./models";
import {
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "@/lib/validators/blog";

export class BlogRepository {
  constructor(private db: Db) {}

  private get collection() {
    return this.db.collection("blog_posts");
  }

  /**
   * Create a new blog post
   */
  async create(data: CreateBlogPostInput): Promise<BlogPost> {
    const now = new Date();
    const publishedAt = data.publishedAt
      ? new Date(data.publishedAt)
      : data.status === "published"
      ? now
      : null;

    const doc = {
      ...data,
      publishedAt,
      createdAt: now,
      updatedAt: now,
    };

    const validated = BlogPostSchema.parse(doc);
    const result = await this.collection.insertOne(validated as any);

    return {
      ...validated,
      _id: result.insertedId,
    } as BlogPost;
  }

  /**
   * Get blog post by ID
   */
  async getById(id: string | ObjectId): Promise<BlogPost | null> {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    const doc = await this.collection.findOne({ _id: objectId });
    return doc as BlogPost | null;
  }

  /**
   * Get blog post by slug
   */
  async getBySlug(slug: string): Promise<BlogPost | null> {
    const doc = await this.collection.findOne({ slug });
    return doc as BlogPost | null;
  }

  /**
   * List all published posts (for public)
   */
  async listPublished(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    posts: BlogPost[];
    total: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const filter: Filter<BlogPost> = { status: "published" };

    const total = await this.collection.countDocuments(filter);
    const posts = (await this.collection
      .find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()) as BlogPost[];

    return {
      posts,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * List all posts (for admin)
   */
  async listAll(
    page: number = 1,
    limit: number = 10,
    status?: "draft" | "published",
  ): Promise<{
    posts: BlogPost[];
    total: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const filter: Filter<BlogPost> = status ? { status } : {};

    const total = await this.collection.countDocuments(filter);
    const posts = (await this.collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()) as BlogPost[];

    return {
      posts,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Search posts by title or excerpt
   */
  async search(query: string, limit: number = 10): Promise<BlogPost[]> {
    const posts = (await this.collection
      .find({
        status: "published",
        $or: [
          { title: { $regex: query, $options: "i" } },
          { excerpt: { $regex: query, $options: "i" } },
        ],
      })
      .limit(limit)
      .toArray()) as BlogPost[];

    return posts;
  }

  /**
   * Get posts by category
   */
  async getByCategory(
    category: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    posts: BlogPost[];
    total: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const filter: Filter<BlogPost> = {
      status: "published",
      categories: category,
    };

    const total = await this.collection.countDocuments(filter);
    const posts = (await this.collection
      .find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()) as BlogPost[];

    return {
      posts,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get posts by tag
   */
  async getByTag(
    tag: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    posts: BlogPost[];
    total: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const filter: Filter<BlogPost> = {
      status: "published",
      tags: tag,
    };

    const total = await this.collection.countDocuments(filter);
    const posts = (await this.collection
      .find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()) as BlogPost[];

    return {
      posts,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get related posts (same category, different ID)
   */
  async getRelated(
    postId: string | ObjectId,
    limit: number = 3,
  ): Promise<BlogPost[]> {
    const objectId = typeof postId === "string" ? new ObjectId(postId) : postId;
    const currentPost = await this.getById(objectId);

    if (!currentPost || !currentPost.categories.length) {
      return [];
    }

    const posts = (await this.collection
      .find({
        _id: { $ne: objectId },
        status: "published",
        categories: { $in: currentPost.categories },
      })
      .limit(limit)
      .toArray()) as BlogPost[];

    return posts;
  }

  /**
   * Update a blog post
   */
  async update(
    id: string | ObjectId,
    data: UpdateBlogPostInput,
  ): Promise<BlogPost | null> {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;

    const updateData = {
      ...data,
      updatedAt: new Date(),
      publishedAt:
        data.status === "published"
          ? new Date(data.publishedAt || new Date())
          : null,
    };

    const result = await this.collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: "after" },
    );

    return result?.value as BlogPost | null;
  }

  /**
   * Delete a blog post
   */
  async delete(id: string | ObjectId): Promise<boolean> {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    const result = await this.collection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }

  /**
   * Publish a blog post (change status to published)
   */
  async publish(id: string | ObjectId): Promise<BlogPost | null> {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    console.log(`[BlogRepo] Publishing post:`, objectId.toString());

    const result = await this.update(objectId, {
      status: "published",
      publishedAt: new Date().toISOString(),
    } as UpdateBlogPostInput);

    console.log(`[BlogRepo] Publish result:`, {
      success: !!result,
      status: result?.status,
      publishedAt: result?.publishedAt,
    });

    return result;
  }

  /**
   * Unpublish a blog post
   */
  async unpublish(id: string | ObjectId): Promise<BlogPost | null> {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    console.log(`[BlogRepo] Unpublishing post:`, objectId.toString());

    const result = await this.update(objectId, {
      status: "draft",
    } as UpdateBlogPostInput);

    console.log(`[BlogRepo] Unpublish result:`, {
      success: !!result,
      status: result?.status,
    });

    return result;
  }

  /**
   * Ensure database indexes for performance
   */
  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex({ slug: 1 }, { unique: true });
    await this.collection.createIndex({ status: 1, publishedAt: -1 });
    await this.collection.createIndex({ categories: 1 });
    await this.collection.createIndex({ tags: 1 });
    await this.collection.createIndex({ title: "text", excerpt: "text" });
  }
}
