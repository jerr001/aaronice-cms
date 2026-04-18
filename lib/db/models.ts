/**
 * Zod schemas for database models
 * These define the shape of documents in MongoDB
 */

import { z } from "zod";
import { ObjectId } from "mongodb";

// ==================== BlogPost ====================

export const BlogPostSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters")
    .max(500),
  content: z.string().min(20, "Content must be at least 20 characters"), // JSON from TipTap
  featuredImage: z
    .string()
    .refine((val) => {
      if (!val) return true; // optional
      return (
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("/")
      );
    }, "Featured image must be a valid URL or local path")
    .optional(),
  authorName: z.string().min(1, "Author name is required").max(100),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  ogImage: z
    .string()
    .refine((val) => {
      if (!val) return true; // optional
      return (
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("/")
      );
    }, "OG image must be a valid URL or local path")
    .optional(),
  publishedAt: z.date().nullable().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

// ==================== PageContent ====================

export const PageContentSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  pageId: z.enum([
    "home",
    "about",
    "services",
    "contact",
    "footer",
    "pricing", // optional: if page exists
  ]),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: z.string().url().optional(),
  mainContent: z.string().optional(), // JSON or HTML
  sections: z
    .array(
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        image: z.string().url().optional(),
      }),
    )
    .default([]),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  socialLinks: z
    .object({
      facebook: z.string().url().optional(),
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      instagram: z.string().url().optional(),
    })
    .optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  ogImage: z.string().url().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type PageContent = z.infer<typeof PageContentSchema>;

// ==================== AdminUser ====================

export const AdminUserSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"), // hashed in DB
  role: z.enum(["admin", "editor"]).default("editor"),
  name: z.string().min(1, "Name is required").max(100).optional(),
  isActive: z.boolean().default(true),
  lastLogin: z.date().nullable().optional(),
  resetToken: z.string().nullable().optional(), // For password reset
  resetTokenExpiry: z.date().nullable().optional(), // Token expiration time
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;

// ==================== JWTPayload ====================

export const JWTPayloadSchema = z.object({
  sub: z.string(), // user ID
  email: z.string().email(),
  role: z.enum(["admin", "editor"]),
  iat: z.number(),
  exp: z.number(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
