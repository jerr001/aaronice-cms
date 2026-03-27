/**
 * Public Blog List Page
 * Route: /blog
 * Displays all published blog posts with pagination
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogRepository } from "@/lib/db/index";
import { getDatabase } from "@/lib/db/index";
import BlogFeaturedImage from "@/components/Blog/BlogFeaturedImage";

// Make this page render dynamically instead of static
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog - Aaronice Prime",
  description:
    "Read our latest blog posts about AI, technology, and digital transformation.",
  openGraph: {
    title: "Blog - Aaronice Prime",
    description:
      "Read our latest blog posts about AI, technology, and digital transformation.",
    type: "website",
    url: "https://aaronice.com/blog",
  },
};

interface BlogPageProps {
  searchParams: { page?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = 9;

  try {
    const blogRepo = await getBlogRepository();
    const { posts, total, pages } = await blogRepo.listPublished(page, limit);

    return (
      <div>
        {/* Hero Section */}
        <section className="mt-20 bg-gradient-to-br from-slate-900 to-slate-800 py-20 text-white">
          <div className="mx-auto max-w-4xl px-4">
            <h1 className="mb-4 text-5xl font-bold">Blog & Insights</h1>
            <p className="text-xl text-slate-300">
              Read our latest stories about AI, technology, and digital
              transformation
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            {posts.length > 0 ? (
              <>
                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <article
                      key={post._id?.toString()}
                      className="overflow-hidden rounded-lg bg-white shadow-lg transition hover:shadow-xl"
                    >
                      {/* Featured Image */}
                      <div className="relative h-56 overflow-hidden bg-gray-300">
                        {post.featuredImage ? (
                          <BlogFeaturedImage
                            src={post.featuredImage}
                            alt={post.title}
                            className="h-full w-full object-contain transition hover:scale-105"
                          />
                        ) : null}
                        {!post.featuredImage && (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                            <span className="text-sm text-gray-400">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Categories */}
                        {post.categories && post.categories.length > 0 && (
                          <div className="mb-3 flex gap-2">
                            {post.categories.slice(0, 2).map((cat) => (
                              <span
                                key={cat}
                                className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-700"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="mb-2 line-clamp-2 text-xl font-bold">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="transition hover:text-orange-500"
                          >
                            {post.title}
                          </Link>
                        </h3>

                        {/* Excerpt */}
                        <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                          {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
                          <span>{post.authorName}</span>
                          <span>
                            {post.publishedAt &&
                              new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Read More Link */}
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-block font-semibold text-orange-500 hover:text-orange-600"
                        >
                          Read More →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    {page > 1 && (
                      <Link
                        href={`/blog?page=${page - 1}`}
                        className="rounded bg-gray-200 px-4 py-2 font-medium hover:bg-gray-300"
                      >
                        ← Previous
                      </Link>
                    )}

                    <div className="flex gap-2">
                      {Array.from({ length: pages }, (_, i) => i + 1).map(
                        (p) => (
                          <Link
                            key={p}
                            href={`/blog?page=${p}`}
                            className={`rounded px-3 py-2 font-medium ${
                              p === page
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            {p}
                          </Link>
                        ),
                      )}
                    </div>

                    {page < pages && (
                      <Link
                        href={`/blog?page=${page + 1}`}
                        className="rounded bg-gray-200 px-4 py-2 font-medium hover:bg-gray-300"
                      >
                        Next →
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="mb-4 text-lg text-gray-600">No posts found</p>
                <Link
                  href="/"
                  className="font-medium text-orange-500 hover:text-orange-600"
                >
                  Back to Home
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return (
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-lg text-gray-600">Error loading blog posts</p>
          <Link
            href="/"
            className="mt-4 inline-block font-medium text-orange-500 hover:text-orange-600"
          >
            Back to Home
          </Link>
        </div>
      </section>
    );
  }
}
