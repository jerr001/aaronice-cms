/**
 * Admin Blog List Page
 * Route: /admin/blog
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { BlogPost } from "@/lib/db/models";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog?page=${page}&limit=${limit}`);
      const data = await res.json();

      if (res.ok) {
        setPosts(data.data || []);
        setTotal(data.total || 0);
      } else {
        toast.error(data.error || "Failed to fetch posts");
      }
    } catch (error) {
      toast.error("Error fetching posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });

      if (res.ok) {
        toast.success("Post deleted successfully");
        fetchPosts();
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      toast.error("Error deleting post");
    }
  };

  const handlePublish = async (id: string, currentStatus: string) => {
    try {
      const action = currentStatus === "published" ? "unpublish" : "publish";
      const res = await fetch(`/api/admin/blog/${id}/${action}`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success(`Post ${action}ed successfully`);
        fetchPosts();
      } else {
        toast.error(`Failed to ${action} post`);
      }
    } catch (error) {
      toast.error("Error updating post");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/admin" className="transition hover:text-orange-500">
          Dashboard
        </Link>
        <span>→</span>
        <span className="font-medium text-gray-900">Blog Posts</span>
      </div>

      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-2 text-gray-600">
            Create, edit, and manage all your blog posts
          </p>
        </div>
        <Link
          href="/admin/blog/create"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-orange-600"
        >
          <span>+</span>
          <span>New Post</span>
        </Link>
      </div>

      {loading && (
        <div className="py-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                  Published
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                  Author
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr
                  key={post._id?.toString()}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{post.title}</p>
                      <p className="text-xs text-gray-500">{post.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.authorName}
                  </td>
                  <td className="flex gap-2 px-6 py-4">
                    <Link
                      href={`/admin/blog/${post._id}`}
                      className="text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() =>
                        handlePublish(post._id!.toString(), post.status)
                      }
                      className="text-sm font-medium text-orange-600 transition hover:text-orange-700 hover:underline"
                    >
                      {post.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(post._id!.toString())}
                      className="text-sm font-medium text-red-600 transition hover:text-red-700 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
              <p className="text-sm text-gray-600">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span> ({total}{" "}
                total posts)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center shadow-sm">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2v-5.5a2.972 2.972 0 002-2.5V6"
            />
          </svg>
          <p className="mb-6 text-gray-600">No blog posts yet</p>
          <Link
            href="/admin/blog/create"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition hover:bg-orange-600"
          >
            <span>+</span>
            <span>Create your first post</span>
          </Link>
        </div>
      )}
    </div>
  );
}
