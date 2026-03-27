/**
 * Public Blog List Page
 * Route: /blog
 * Displays all published blog posts
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog - Aaronice Prime",
  description:
    "Read our latest blog posts about AI, technology, and digital transformation.",
};

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  author: string;
  createdAt: string;
  views?: number;
}

async function getBlogPosts(page: number = 1) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/public/blog?page=${page}&limit=12`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { data: [], pagination: { page: 1, total: 0, totalPages: 0 } };
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = parseInt(searchParams.page || "1");
  const { data: posts, pagination } = await getBlogPosts(currentPage);

  return (
    <div className="min-h-screen">
      {/* Hero Section with proper spacing */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl pt-10">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Blog & Insights</h1>
          <p className="text-lg text-slate-300 sm:text-xl">
            Read our latest stories about AI, technology, and digital
            transformation
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {posts && posts.length > 0 ? (
            <>
              <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: BlogPost) => (
                  <article
                    key={post._id}
                    className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-xl"
                  >
                    {/* Featured Image */}
                    {post.featuredImage && (
                      <div className="relative h-48 overflow-hidden bg-gray-200">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover transition hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      {/* Category Badge */}
                      <span className="mb-3 inline-block w-fit rounded bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        {post.category}
                      </span>

                      {/* Title */}
                      <h3 className="mb-3 line-clamp-2 text-xl font-bold">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition hover:text-orange-500"
                        >
                          {post.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-600">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="mb-4 flex items-center justify-between border-t pt-4 text-xs text-gray-500">
                        <span>{post.author}</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Read More Link */}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-semibold text-orange-500 transition hover:text-orange-600"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination?.totalPages > 1 && (
                <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                  {currentPage > 1 && (
                    <Link
                      href={`/blog?page=${currentPage - 1}`}
                      className="rounded bg-gray-200 px-4 py-2 font-medium transition hover:bg-gray-300"
                    >
                      ← Previous
                    </Link>
                  )}

                  <div className="flex gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Link
                          key={page}
                          href={`/blog?page=${page}`}
                          className={`rounded px-3 py-2 font-medium transition ${
                            page === currentPage
                              ? "bg-orange-500 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          {page}
                        </Link>
                      ),
                    )}
                  </div>

                  {currentPage < pagination.totalPages && (
                    <Link
                      href={`/blog?page=${currentPage + 1}`}
                      className="rounded bg-gray-200 px-4 py-2 font-medium transition hover:bg-gray-300"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="mb-6 text-lg text-gray-600">
                No blog posts available yet. Check back soon!
              </p>
              <Link
                href="/"
                className="inline-block font-medium text-orange-500 transition hover:text-orange-600"
              >
                ← Back to Home
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

