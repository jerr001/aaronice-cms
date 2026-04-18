/**
 * Admin Blog Comments Moderation
 * Route: /admin/blog-comments
 * Moderate and manage blog comments
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { BlogComment } from "@/types/blog-engagement";

export default function BlogCommentsPage() {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">(
    "pending",
  );

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/admin/blog-comments");
      const data = await res.json();

      if (res.ok && data.data) {
        setComments(data.data);
      }
    } catch (error) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog-comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: false }),
      });

      if (res.ok) {
        toast.success("Comment removed");
        fetchComments();
      }
    } catch (error) {
      toast.error("Error removing comment");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog-comments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Comment deleted");
        fetchComments();
      }
    } catch (error) {
      toast.error("Error deleting comment");
    }
  };

  const filteredComments = comments.filter((c) => {
    if (filter === "pending") return !c.approved;
    if (filter === "approved") return c.approved;
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/admin" className="transition hover:text-blue-500">
          Dashboard
        </Link>
        <span>→</span>
        <span className="font-medium text-gray-900">Blog Comments</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Comments</h1>
          <p className="mt-2 text-gray-600">
            Moderate comments from blog readers
          </p>
        </div>
        <button
          onClick={fetchComments}
          disabled={loading}
          className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-600 disabled:bg-gray-300"
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setFilter("pending")}
          className={`px-1 pb-3 font-medium transition ${
            filter === "pending"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Removed ({comments.filter((c) => !c.approved).length})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-1 pb-3 font-medium transition ${
            filter === "approved"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Published ({comments.filter((c) => c.approved).length})
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-1 pb-3 font-medium transition ${
            filter === "all"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          All ({comments.length})
        </button>
      </div>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">
            {filter === "pending"
              ? "No removed comments"
              : filter === "approved"
              ? "No published comments"
              : "No comments found"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`rounded-lg border p-6 shadow-sm ${
                comment.approved
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {comment.author}
                  </p>
                  <p className="text-sm text-gray-600">{comment.email}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    on post: <strong>{comment.postSlug}</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    comment.approved
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {comment.approved ? "✓ Published" : "✕ Removed"}
                </span>
              </div>

              {/* Content */}
              <p className="mb-4 text-gray-700">{comment.content}</p>

              {/* Actions */}
              <div className="flex gap-2">
                {comment.approved && (
                  <button
                    onClick={() => handleApprove(comment.id)}
                    className="rounded-lg bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600 transition hover:bg-orange-200"
                  >
                    Remove
                  </button>
                )}
                <button
                  onClick={() => handleReject(comment.id)}
                  className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
