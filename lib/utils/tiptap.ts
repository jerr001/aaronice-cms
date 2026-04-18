/**
 * TipTap Content Utilities
 * Convert TipTap JSON format to plain text or HTML
 */

interface TipTapNode {
  type: string;
  content?: TipTapNode[];
  text?: string;
  marks?: Array<{ type: string }>;
  attrs?: { [key: string]: any };
}

interface TipTapContent {
  type: string;
  content?: TipTapNode[];
}

/**
 * Extract plain text from TipTap JSON content
 * Handles nested structures and formatting
 */
export function extractTextFromTipTap(
  jsonString: string | null | undefined,
): string {
  if (!jsonString) return "";

  try {
    // Try to parse if it's a JSON string
    if (typeof jsonString === "string") {
      // Check if it looks like JSON
      if (jsonString.startsWith("{")) {
        const content: TipTapContent = JSON.parse(jsonString);
        if (content && content.content) {
          return content.content
            .map((node: TipTapNode) => extractNodeText(node))
            .join("\n")
            .trim();
        }
      } else {
        // Return as plain text if not JSON
        return jsonString;
      }
    }
  } catch (error) {
    // If parsing fails, return as plain text
    if (typeof jsonString === "string") {
      return jsonString;
    }
  }

  return "";
}

/**
 * Recursively extract text from a TipTap node
 */
function extractNodeText(node: TipTapNode): string {
  if (!node) return "";

  // If node has text property, return it
  if (node.text) {
    return node.text;
  }

  // If node has children, recursively extract their text
  if (node.content && Array.isArray(node.content)) {
    return node.content
      .map((child: TipTapNode) => extractNodeText(child))
      .join("");
  }

  return "";
}

/**
 * Convert TipTap JSON to simple HTML
 */
export function convertTipTapToHtml(
  jsonString: string | null | undefined,
): string {
  if (!jsonString) return "";

  try {
    let content: TipTapContent;

    if (typeof jsonString === "string") {
      if (jsonString.startsWith("{")) {
        content = JSON.parse(jsonString);
      } else {
        return `<p>${escapeHtml(jsonString)}</p>`;
      }
    } else {
      return "";
    }

    if (!content || !content.content) return "";

    return content.content
      .map((node: TipTapNode) => nodeToHtml(node))
      .join("\n");
  } catch (error) {
    if (typeof jsonString === "string") {
      return `<p>${escapeHtml(jsonString)}</p>`;
    }
    return "";
  }
}

/**
 * Convert a TipTap node to HTML
 */
function nodeToHtml(node: TipTapNode): string {
  if (!node) return "";

  switch (node.type) {
    case "paragraph":
      const content =
        node.content?.map((child: TipTapNode) => nodeToHtml(child)).join("") ||
        "";
      return `<p>${content}</p>`;

    case "heading":
      const level = node.attrs?.level || 1;
      const headingContent =
        node.content?.map((child: TipTapNode) => nodeToHtml(child)).join("") ||
        "";
      return `<h${level}>${headingContent}</h${level}>`;

    case "text":
      let text = escapeHtml(node.text || "");
      if (node.marks) {
        if (node.marks.some((m) => m.type === "bold"))
          text = `<strong>${text}</strong>`;
        if (node.marks.some((m) => m.type === "italic"))
          text = `<em>${text}</em>`;
        if (node.marks.some((m) => m.type === "code"))
          text = `<code>${text}</code>`;
      }
      return text;

    case "bulletList":
      const bulletItems = node.content
        ?.map((child: TipTapNode) => nodeToHtml(child))
        .join("");
      return `<ul>${bulletItems}</ul>`;

    case "orderedList":
      const orderedItems = node.content
        ?.map((child: TipTapNode) => nodeToHtml(child))
        .join("");
      return `<ol>${orderedItems}</ol>`;

    case "listItem":
      const listContent =
        node.content?.map((child: TipTapNode) => nodeToHtml(child)).join("") ||
        "";
      return `<li>${listContent}</li>`;

    default:
      return (
        node.content?.map((child: TipTapNode) => nodeToHtml(child)).join("") ||
        ""
      );
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
