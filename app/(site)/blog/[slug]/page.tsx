/**
 * Public Blog Post Detail Page
 * Route: /blog/[slug]
 * Displays a single blog post with related posts
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogRepository } from "@/lib/db/index";
import { extractTextFromTipTapJson } from "@/lib/utils/text";
import BlogEngagement from "@/components/Blog/BlogEngagement";
import BlogFeaturedImage from "@/components/Blog/BlogFeaturedImage";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const blogRepo = await getBlogRepository();
    const post = await blogRepo.getBySlug(params.slug);

    if (!post || post.status !== "published") {
      return {
        title: "Post Not Found",
      };
    }

    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      openGraph: {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        type: "article",
        url: `https://aaronice.com/blog/${post.slug}`,
        images: post.ogImage
          ? [
              {
                url: post.ogImage,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ]
          : post.featuredImage
          ? [
              {
                url: post.featuredImage,
                alt: post.title,
              },
            ]
          : undefined,
        authors: [post.authorName || "Aaronice"],
        publishedTime: post.publishedAt?.toString(),
        tags: [...(post.categories || []), ...(post.tags || [])],
      },
    };
  } catch (error) {
    return {
      title: "Blog Post",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const blogRepo = await getBlogRepository();
    const post = await blogRepo.getBySlug(params.slug);

    if (!post || post.status !== "published") {
      notFound();
    }

    // Get related posts
    const relatedPosts = await blogRepo.getRelated(post._id!, 3);

    // Parse content
    let contentHtml = "";
    try {
      const contentObj = JSON.parse(post.content);
      // In production, you'd render this with a proper JSON renderer
      // For now, we'll extract text
    } catch (e) {
      contentHtml = post.content;
    }

    return (
      <article>
        {/* Hero Section */}
        <section className="mt-20 bg-gradient-to-br from-slate-900 to-slate-800 py-12 text-white">
          <div className="mx-auto max-w-4xl px-4">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="mb-4 flex gap-2">
                {post.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded bg-orange-500/30 px-2 py-1 text-xs text-orange-200"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <h1 className="mb-4 text-5xl font-bold">{post.title}</h1>

            {/* Meta */}
            <div className="flex gap-6 text-sm text-slate-300">
              <span>By {post.authorName}</span>
              {post.publishedAt && (
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {post.tags && post.tags.length > 0 && (
                <span>{post.tags.join(", ")}</span>
              )}
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="bg-white py-0">
          <div className="relative h-80 w-full overflow-hidden bg-gray-300 md:h-96">
            {post.featuredImage ? (
              <BlogFeaturedImage
                src={post.featuredImage}
                alt={post.title}
                className="h-full w-full object-contain"
              />
            ) : null}
            {!post.featuredImage && (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                <div className="text-center">
                  <p className="text-lg text-gray-400">No Featured Image</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Add an image in the blog editor
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-4xl px-4">
            <div className="prose prose-lg mb-8 max-w-none">
              {/* Excerpt */}
              <p className="mb-8 text-xl text-gray-600 italic">
                {post.excerpt}
              </p>

              {/* Content - Rendered as rich text */}
              <div
                className="leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: renderTipTapContent(post.content),
                }}
              />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 border-t pt-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/filter?tag=${encodeURIComponent(tag)}`}
                    className="rounded bg-gray-100 px-3 py-1 text-gray-700 transition hover:bg-orange-100 hover:text-orange-700"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Blog Engagement - Comments & Likes */}
        <BlogEngagement slug={post.slug} />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="mx-auto max-w-6xl px-4">
              <h2 className="mb-8 text-3xl font-bold">Related Posts</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost._id?.toString()}
                    href={`/blog/${relatedPost.slug}`}
                    className="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
                  >
                    <div className="relative h-40 overflow-hidden bg-gray-200">
                      {relatedPost.featuredImage ? (
                        <BlogFeaturedImage
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="h-full w-full object-contain transition hover:scale-105"
                        />
                      ) : null}
                      {!relatedPost.featuredImage && (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                          <span className="text-xs text-gray-400">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 font-semibold text-gray-900">
                        {relatedPost.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-orange-50 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">More to explore?</h2>
            <p className="mb-6 text-gray-600">
              Check out our other blog posts and resources
            </p>
            <Link
              href="/blog"
              className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              View All Posts
            </Link>
          </div>
        </section>
      </article>
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}

/**
 * Convert TipTap JSON to HTML for display
 * This is a simplified version - in production, use a proper renderer
 */
function renderTipTapContent(jsonContent: string): string {
  try {
    const content = JSON.parse(jsonContent);
    let html = "";

    const renderNode = (node: any): string => {
      let result = "";

      switch (node.type) {
        case "doc":
        case "paragraph":
          result = node.content
            ? `<p>${node.content.map(renderNode).join("")}</p>`
            : "<p></p>";
          break;

        case "heading":
          const level = node.attrs?.level || 1;
          result = `<h${level}>${
            node.content?.map(renderNode).join("") || ""
          }</h${level}>`;
          break;

        case "bulletList":
          result = `<ul>${
            node.content
              ?.map((item: any) => `<li>${renderNode(item)}</li>`)
              .join("") || ""
          }</ul>`;
          break;

        case "orderedList":
          result = `<ol>${
            node.content
              ?.map((item: any) => `<li>${renderNode(item)}</li>`)
              .join("") || ""
          }</ol>`;
          break;

        case "listItem":
          result = node.content?.map(renderNode).join("") || "";
          break;

        case "codeBlock":
          result = `<pre><code>${
            node.content?.map(renderNode).join("") || ""
          }</code></pre>`;
          break;

        case "blockquote":
          result = `<blockquote>${
            node.content?.map(renderNode).join("") || ""
          }</blockquote>`;
          break;

        case "text":
          result = node.text || "";
          if (node.marks) {
            node.marks.forEach((mark: any) => {
              switch (mark.type) {
                case "bold":
                  result = `<strong>${result}</strong>`;
                  break;
                case "italic":
                  result = `<em>${result}</em>`;
                  break;
                case "code":
                  result = `<code>${result}</code>`;
                  break;
                case "link":
                  result = `<a href="${mark.attrs?.href}" class="text-blue-500 hover:underline">${result}</a>`;
                  break;
              }
            });
          }
          break;

        case "image":
          result = `<img src="${node.attrs?.src}" alt="${
            node.attrs?.alt || ""
          }" class="max-w-full rounded my-4" />`;
          break;

        default:
          result = node.content?.map(renderNode).join("") || "";
      }

      return result;
    };

    if (content.content) {
      html = content.content.map(renderNode).join("");
    }

    return html;
  } catch (e) {
    return "";
  }
}
