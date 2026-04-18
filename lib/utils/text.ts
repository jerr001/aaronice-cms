/**
 * Utility functions for slug generation and text sanitization
 */

import { createHash } from "crypto";

/**
 * Convert a string to a URL-safe slug
 * Example: "My Blog Post!" -> "my-blog-post"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a hash if needed
 */
export function generateUniqueSlug(
  text: string,
  existingSlugs: string[] = [],
): string {
  let slug = slugify(text);
  let attempts = 0;
  const baseSlug = slug;

  while (existingSlugs.includes(slug) && attempts < 100) {
    const hash = createHash("sha256")
      .update(`${baseSlug}-${attempts}`)
      .digest("hex")
      .slice(0, 6);
    slug = `${baseSlug}-${hash}`;
    attempts++;
  }

  return slug;
}

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Strip HTML tags from text
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Truncate text to a maximum length, ending with ellipsis
 */
export function truncateText(
  text: string,
  maxLength: number = 150,
  suffix: string = "...",
): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Convert plain text to safe HTML (preserve line breaks, escape special chars)
 */
export function textToSafeHtml(text: string): string {
  return escapeHtml(text).split("\n").join("<br />");
}

/**
 * Sanitize user input to prevent XSS attacks
 * Use for plain text inputs (not rich text)
 */
export function sanitizeInput(input: string): string {
  return escapeHtml(input.trim());
}

/**
 * Extract plain text from JSON content (from TipTap)
 */
export function extractTextFromTipTapJson(json: string): string {
  try {
    const doc = JSON.parse(json);
    let text = "";

    const extractText = (node: any): void => {
      if (node.type === "text") {
        text += node.text || "";
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(extractText);
      }
    };

    if (doc.content && Array.isArray(doc.content)) {
      doc.content.forEach(extractText);
    }

    return text;
  } catch {
    return "";
  }
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(
  content: string,
  maxLength: number = 150,
): string {
  const text = stripHtmlTags(content);
  return truncateText(text, maxLength);
}
