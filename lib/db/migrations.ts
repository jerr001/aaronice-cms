/**
 * Database migration and setup script
 * Initializes collections, indexes, and seed data
 * Run once on app startup
 */

import { Db } from "mongodb";
import { BlogRepository } from "./blog";
import { PageContentRepository } from "./pages";
import { AdminUserRepository } from "./users";

/**
 * Initialize database: create collections, indexes, and seed data
 */
export async function initializeDatabase(db: Db): Promise<void> {
  try {
    console.log("[DB] Initializing database...");

    // Initialize repositories
    const blogRepo = new BlogRepository(db);
    const pageRepo = new PageContentRepository(db);
    const userRepo = new AdminUserRepository(db);

    // Create indexes
    console.log("[DB] Creating indexes...");
    await blogRepo.ensureIndexes();
    await pageRepo.ensureIndexes();
    await userRepo.ensureIndexes();

    // Seed default admin user if none exists
    await seedDefaultAdmin(userRepo);

    console.log("[DB] Database initialization complete");
  } catch (error) {
    console.error("[DB] Initialization error:", error);
    throw error;
  }
}

/**
 * Seed default admin user if database is empty
 */
async function seedDefaultAdmin(userRepo: AdminUserRepository): Promise<void> {
  try {
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL;
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn(
        "[DB] ADMIN_DEFAULT_EMAIL or ADMIN_DEFAULT_PASSWORD not set. Skipping default admin creation.",
      );
      return;
    }

    // Check if admin already exists
    const existingAdmin = await userRepo.getByEmail(adminEmail);
    if (existingAdmin) {
      console.log("[DB] Default admin user already exists");
      return;
    }

    // Create default admin
    await userRepo.create({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin",
    });

    console.log(`[DB] Created default admin user: ${adminEmail}`);
  } catch (error) {
    console.error("[DB] Error seeding default admin:", error);
    // Don't throw - allow app to continue even if seeding fails
  }
}

/**
 * Seed sample blog post (for development/demo)
 */
export async function seedSampleBlogPost(
  blogRepo: BlogRepository,
): Promise<void> {
  try {
    const existing = await blogRepo.getBySlug("welcome-to-aaronice");
    if (existing) {
      console.log("[DB] Sample blog post already exists");
      return;
    }

    await blogRepo.create({
      title: "Welcome to Aaronice Blog",
      slug: "welcome-to-aaronice",
      excerpt:
        "Welcome to the official Aaronice blog. Here we share insights on AI, technology, and digital transformation.",
      content: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Welcome" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "This is a sample blog post created during database initialization. You can edit or delete this post from the admin dashboard.",
              },
            ],
          },
        ],
      }),
      authorName: "Aaronice Team",
      categories: ["Updates"],
      tags: ["announcement"],
      status: "published",
      seoTitle: "Welcome to Aaronice Blog",
      seoDescription:
        "Read insights about AI, technology, and digital transformation at Aaronice.",
    });

    console.log("[DB] Created sample blog post");
  } catch (error) {
    console.error("[DB] Error seeding sample blog post:", error);
  }
}

/**
 * Drop all collections (use with caution - only for development!)
 */
export async function resetDatabase(db: Db): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Cannot reset database in production");
  }

  try {
    console.log("[DB] Resetting database...");
    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
      console.log(`[DB] Cleared collection: ${collection.name}`);
    }

    console.log("[DB] Database reset complete");
  } catch (error) {
    console.error("[DB] Error resetting database:", error);
    throw error;
  }
}
