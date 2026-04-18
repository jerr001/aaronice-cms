/**
 * Admin Blog Editor Page
 * Route: /admin/blog/create (new post)
 * Route: /admin/blog/[id] (edit post)
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { RichEditor } from "@/components/Admin/RichEditor";
import { BlogPost } from "@/lib/db/models";
import { slugify } from "@/lib/utils/text";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  authorName: string;
  categories: string[];
  tags: string[];
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
}

export default function BlogEditorPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;
  const isNew = !postId || postId === "create";

  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] }),
    featuredImage: "",
    authorName: "",
    categories: [],
    tags: [],
    status: "draft",
    seoTitle: "",
    seoDescription: "",
    ogImage: "",
  });

  useEffect(() => {
    if (!isNew) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Not authenticated");
        router.push("/admin/login");
        return;
      }

      const res = await fetch(`/api/admin/blog/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setForm(data.data);
        toast.success("Post loaded successfully");
      } else {
        toast.error("Failed to load post");
        router.back();
      }
    } catch (error) {
      toast.error("Error loading post");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm({
      ...form,
      title,
      slug: slugify(title),
      seoTitle: title.slice(0, 60),
    });
  };

  // Helper function to validate URLs
  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof BlogFormData,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Get token from localStorage
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const res = await fetch("/api/media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const imageUrl = data.data.file.url;
        console.log("[Blog Upload] Image uploaded successfully");
        console.log("[Blog Upload] Image URL:", imageUrl);
        console.log("[Blog Upload] File details:", data.data.file);

        setForm({
          ...form,
          [field]: imageUrl,
        });

        // Also update localStorage so image picker sees it
        const stored = localStorage.getItem("uploadedMedia");
        const files = stored ? JSON.parse(stored) : [];
        const updatedFiles = [data.data.file, ...files];
        localStorage.setItem("uploadedMedia", JSON.stringify(updatedFiles));

        toast.success("Image uploaded successfully");
      } else {
        console.error("[Blog Upload] Upload failed:", data);
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: any, saveStatus: "draft" | "published") => {
    e.preventDefault?.();
    e.stopPropagation?.();
    setSubmitting(true);

    try {
      // Validation
      if (!form.title.trim()) {
        toast.error("Title is required");
        setSubmitting(false);
        return;
      }

      if (!form.excerpt.trim() || form.excerpt.trim().length < 10) {
        toast.error("Excerpt must be at least 10 characters");
        setSubmitting(false);
        return;
      }

      if (!form.authorName.trim()) {
        toast.error("Author name is required");
        setSubmitting(false);
        return;
      }

      // Get auth token
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Not authenticated");
        setSubmitting(false);
        return;
      }

      // Build simple payload - only send what's needed
      const payload: any = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        authorName: form.authorName,
        status: saveStatus,
      };

      // Add optional fields only if they have values
      if (form.categories && form.categories.length > 0) {
        payload.categories = form.categories;
      } else {
        payload.categories = [];
      }

      if (form.tags && form.tags.length > 0) {
        payload.tags = form.tags;
      } else {
        payload.tags = [];
      }

      if (form.seoTitle?.trim()) {
        payload.seoTitle = form.seoTitle;
      }

      if (form.seoDescription?.trim()) {
        payload.seoDescription = form.seoDescription;
      }

      if (form.featuredImage?.trim()) {
        payload.featuredImage = form.featuredImage;
      }

      if (form.ogImage?.trim()) {
        payload.ogImage = form.ogImage;
      }

      if (saveStatus === "published") {
        payload.publishedAt = new Date().toISOString();
      }

      console.log("[Blog] Publishing:", {
        isNew,
        status: saveStatus,
        title: form.title,
      });

      console.log("[Blog] Payload:", JSON.stringify(payload, null, 2));

      let res;
      let requestBody: string;

      try {
        requestBody = JSON.stringify(payload);
      } catch (e: any) {
        console.error("[Blog] JSON.stringify error:", e.message);
        toast.error("Error preparing post data");
        setSubmitting(false);
        return;
      }

      if (isNew) {
        res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: requestBody,
        });
      } else {
        res = await fetch(`/api/admin/blog/${postId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: requestBody,
        });
      }

      const data = await res.json();

      console.log("[Blog] Response status:", res.status);
      console.log("[Blog] Response data:", JSON.stringify(data, null, 2));

      if (res.ok) {
        toast.success(
          `✓ Post ${saveStatus === "published" ? "published" : "saved"}!`,
        );
        setTimeout(() => {
          router.push("/admin/blog");
        }, 1000);
      } else {
        const errorMsg = data.error || data.message || JSON.stringify(data);
        toast.error(errorMsg || "Failed to save post");
        console.error(
          "[Blog] Full error response:",
          JSON.stringify(data, null, 2),
        );
      }
    } catch (error: any) {
      console.error("[Blog] Catch error:", {
        message: error?.message,
        stack: error?.stack,
        toString: error?.toString?.(),
      });
      toast.error("Error saving post: " + (error?.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to extract text from TipTap JSON
  const extractTextFromJson = (doc: any): string => {
    let text = "";
    const traverse = (node: any) => {
      if (node.type === "text" && node.text) {
        text += node.text;
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };
    traverse(doc);
    return text;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/admin" className="transition hover:text-orange-500">
          Dashboard
        </Link>
        <span>→</span>
        <Link href="/admin/blog" className="transition hover:text-orange-500">
          Blog Posts
        </Link>
        <span>→</span>
        <span className="font-medium text-gray-900">
          {isNew ? "Create New Post" : "Edit Post"}
        </span>
      </div>

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? "Create New Post" : "Edit Post"}
          </h1>
          <p className="mt-2 text-gray-600">
            {isNew
              ? "Write and publish a new blog post"
              : `Editing: ${form.title || "Untitled Post"}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          ← Back
        </button>
      </div>

      {loading && (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
        </div>
      )}

      {!loading && (
        <form className="space-y-6">
          {/* Content Section */}
          <div className="space-y-4 rounded-lg border-l-4 border-l-orange-500 bg-white p-6 shadow">
            <h2 className="text-lg font-bold text-gray-900">Post Content</h2>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Post Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Enter post title"
                required
                className={`w-full rounded-lg border ${
                  !form.title.trim() ? "border-red-300" : "border-gray-300"
                } px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none`}
              />
              {!form.title.trim() && (
                <p className="mt-1 text-xs text-red-600">Title is required</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Excerpt/Summary (minimum 10 characters) *
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Brief summary of the post (appears in blog listings)"
                rows={3}
                className={`w-full rounded-lg border ${
                  form.excerpt.trim().length < 10 &&
                  form.excerpt.trim().length > 0
                    ? "border-red-300"
                    : "border-gray-300"
                } px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none`}
              />
              <p
                className={`mt-1 text-xs ${
                  form.excerpt.trim().length < 10
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {form.excerpt.length}/500 characters
                {form.excerpt.trim().length < 10 &&
                form.excerpt.trim().length > 0
                  ? " - Need at least 10 characters"
                  : ""}
              </p>
            </div>

            {/* Author */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Author Name *
              </label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) =>
                  setForm({ ...form, authorName: e.target.value })
                }
                placeholder="e.g., Aaronice Team"
                className={`w-full rounded-lg border ${
                  !form.authorName.trim() ? "border-red-300" : "border-gray-300"
                } px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none`}
              />
              {!form.authorName.trim() && (
                <p className="mt-1 text-xs text-red-600">
                  Author name is required
                </p>
              )}
            </div>
          </div>

          {/* Featured Image Section */}
          <div className="rounded-lg border-l-4 border-l-blue-500 bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Featured Image
            </h2>

            {/* Debug Info */}
            {form.featuredImage && (
              <div className="mb-4 rounded border border-blue-200 bg-blue-50 p-3">
                <p className="mb-1 text-xs font-semibold text-blue-900">
                  Debug Info:
                </p>
                <p className="font-mono text-xs break-all text-blue-700">
                  URL: {form.featuredImage}
                </p>
                <p className="mt-1 text-xs text-blue-600">
                  This URL will be used when you publish the post. Make sure
                  it's accessible!
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* Image Preview */}
              {form.featuredImage && (
                <div className="relative flex h-64 w-full items-center justify-center overflow-auto rounded-lg bg-gray-100 shadow-md">
                  <img
                    src={form.featuredImage}
                    alt="Featured"
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute inset-0 flex items-end bg-black/0 p-4 transition-colors hover:bg-black/10">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, featuredImage: "" })}
                      className="w-full rounded bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div
                className={`relative rounded-lg border-2 border-dashed transition-all ${
                  form.featuredImage
                    ? "border-gray-200 bg-gray-50"
                    : "border-orange-300 bg-orange-50 hover:border-orange-500"
                } group cursor-pointer p-8 text-center`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("border-orange-500");
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("border-orange-500");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("border-orange-500");
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    const input = document.getElementById(
                      "featured-image-input",
                    ) as HTMLInputElement;
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    input.files = dataTransfer.files;
                    handleImageUpload(
                      { target: { files: dataTransfer.files } } as any,
                      "featuredImage",
                    );
                  } else {
                    toast.error("Please drop an image file");
                  }
                }}
              >
                <input
                  id="featured-image-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "featuredImage")}
                  disabled={imageUploading}
                  className="hidden"
                />
                <label
                  htmlFor="featured-image-input"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2"
                >
                  <svg
                    className={`h-12 w-12 transition-all ${
                      imageUploading
                        ? "text-gray-400"
                        : form.featuredImage
                        ? "text-gray-400"
                        : "text-orange-400 group-hover:text-orange-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="space-y-1">
                    <p
                      className={`text-sm font-semibold ${
                        imageUploading
                          ? "text-gray-500"
                          : form.featuredImage
                          ? "text-gray-600"
                          : "text-orange-900"
                      }`}
                    >
                      {imageUploading
                        ? "Uploading..."
                        : form.featuredImage
                        ? "Change image"
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-600">
                      PNG, JPG, GIF, WebP up to 5MB
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Rich Editor Section */}
          <div className="rounded-lg border-l-4 border-l-green-500 bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Post Content
            </h2>
            <label className="mb-3 block text-sm font-semibold text-gray-900">
              Content *
            </label>
            <RichEditor
              value={form.content}
              onChange={(content) => setForm({ ...form, content })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 rounded-lg bg-gray-50 p-6 shadow">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={submitting}
              className="rounded-lg bg-gray-500 px-6 py-2 font-medium text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "published")}
              disabled={submitting}
              className="rounded-lg bg-orange-500 px-6 py-2 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
