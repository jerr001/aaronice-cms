/**
 * Zod validators for API input validation
 * These are used to validate user input in API routes
 */

import { z } from "zod";

// ==================== Blog Validators ====================

export const CreateBlogPostValidator = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters")
    .max(500),
  content: z.string().min(20, "Content must be at least 20 characters"),
  featuredImage: z
    .string()
    .refine((val) => {
      if (!val) return true; // optional
      // Accept both URLs (http/https) and local paths (/uploads/...)
      return (
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("/")
      );
    }, "Featured image must be a valid URL or local path")
    .optional(),
  authorName: z.string().min(1, "Author name is required").max(100),
  categories: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
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
  publishedAt: z.string().datetime().optional(),
});

export const UpdateBlogPostValidator = CreateBlogPostValidator.partial().omit({
  slug: true,
}); // slug shouldn't change

export type CreateBlogPostInput = z.infer<typeof CreateBlogPostValidator>;
export type UpdateBlogPostInput = z.infer<typeof UpdateBlogPostValidator>;

// ==================== Page Content Validators ====================

export const UpdatePageContentValidator = z.object({
  pageId: z.enum(["home", "about", "services", "contact", "footer", "pricing"]),
  // Home page fields
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: z.string().url().optional(),
  mainContent: z.string().optional(),
  // About page fields
  aboutIntro: z.string().optional(),
  visionStatement: z.string().optional(),
  missionStatement: z.string().optional(),
  // Contact page fields
  contactHeading: z.string().optional(),
  contactDescription: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  // Pricing page fields
  pricingIntro: z.string().optional(),
  pricingHighlight: z.string().optional(),
  // Footer fields
  footerText: z.string().optional(),
  email: z.string().optional(),
  // General fields
  sections: z
    .array(
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        image: z.string().url().optional(),
      }),
    )
    .optional(),
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
});

export type UpdatePageContentInput = z.infer<typeof UpdatePageContentValidator>;

// ==================== Auth Validators ====================

export const LoginValidator = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginValidator>;

export const RegisterAdminValidator = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(100),
  role: z.enum(["admin", "editor"]).default("editor"),
});

export type RegisterAdminInput = z.infer<typeof RegisterAdminValidator>;

// ==================== Pagination ====================

export const PaginationValidator = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type PaginationInput = z.infer<typeof PaginationValidator>;

// ==================== Image Upload ====================

export const ImageUploadValidator = z.object({
  filename: z.string().min(1),
  mimetype: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  size: z.number().max(5242880), // 5MB
});

export type ImageUploadInput = z.infer<typeof ImageUploadValidator>;
