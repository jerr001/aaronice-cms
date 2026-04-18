/**
 * Seed blog post - Creates a test blog post
 * DELETE this endpoint after testing!
 * GET /api/seed/blog-post
 */

import { NextRequest, NextResponse } from "next/server";
import { getBlogRepository } from "@/lib/db/index";
import { successResponse, errorResponse } from "@/lib/utils/response";

export async function GET(request: NextRequest) {
  // Security: Only allow in development
  if (process.env.NODE_ENV === "production") {
    return errorResponse("Not available in production", 403, "FORBIDDEN");
  }

  try {
    const blogRepo = await getBlogRepository();

    // Check if test post already exists
    const existing = await blogRepo.getBySlug("getting-started-with-ai");
    if (existing) {
      return successResponse({
        message: "Test post already exists",
        post: existing,
      });
    }

    // Create test blog post with all fields filled
    const testPost = await blogRepo.create({
      title: "Getting Started with AI Automation",
      slug: "getting-started-with-ai",
      excerpt:
        "Learn the fundamentals of AI automation and how it can transform your business. In this comprehensive guide, we'll explore the key concepts, tools, and best practices for implementing AI solutions.",
      content: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Introduction" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Artificial Intelligence is revolutionizing how businesses operate. From automating repetitive tasks to providing intelligent insights, AI has become an essential tool for modern organizations.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Why AI Automation Matters" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "AI automation helps businesses:",
              },
            ],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Reduce operational costs by up to 40%",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Improve efficiency and productivity",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Enhance customer experience",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Getting Started" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "At Aaronice Prime, we provide comprehensive training and implementation services to help your organization leverage AI automation effectively.",
              },
            ],
          },
        ],
      }),
      featuredImage:
        "https://images.unsplash.com/photo-1677442d019cecf8730f93f00fbf9670?w=800&q=80",
      authorName: "Aaronice Prime Team",
      categories: ["AI", "Automation", "Technology"],
      tags: ["ai", "automation", "business", "technology", "guide"],
      status: "published",
      seoTitle: "Getting Started with AI Automation - Complete Guide",
      seoDescription:
        "Learn how to implement AI automation in your business with our comprehensive guide. Discover tools, best practices, and real-world examples.",
      ogImage:
        "https://images.unsplash.com/photo-1677442d019cecf8730f93f00fbf9670?w=1200&q=80",
    });

    return successResponse({
      message: "Test blog post created successfully",
      post: testPost,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to create test post",
      500,
      "SEED_ERROR",
    );
  }
}
