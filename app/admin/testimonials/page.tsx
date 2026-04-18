/**
 * Admin Testimonials Management
 * Route: /admin/testimonials
 * Create, edit, and manage customer testimonials
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Testimonial } from "@/types/testimonial-admin";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [author, setAuthor] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();

      if (res.ok) {
        setTestimonials(data.data || []);
      } else {
        toast.error("Failed to load testimonials");
      }
    } catch (error) {
      toast.error("Error loading testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAuthor("");
    setCompany("");
    setRole("");
    setContent("");
    setImage("");
    setFeatured(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setAuthor(testimonial.author);
    setCompany(testimonial.company);
    setRole(testimonial.role);
    setContent(testimonial.content);
    setImage(testimonial.image || "");
    setFeatured(testimonial.featured);
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !company.trim() || !role.trim() || !content.trim()) {
      toast.error("All fields except image are required");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/admin/testimonials/${editingId}`
        : "/api/admin/testimonials";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author,
          company,
          role,
          content,
          image: image || undefined,
          featured,
        }),
      });

      if (res.ok) {
        toast.success(
          editingId ? "Testimonial updated" : "Testimonial created",
        );
        fetchTestimonials();
        handleReset();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to save testimonial");
      }
    } catch (error) {
      toast.error("Error saving testimonial");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Testimonial deleted");
        fetchTestimonials();
      }
    } catch (error) {
      toast.error("Error deleting testimonial");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/admin" className="transition hover:text-purple-500">
          Dashboard
        </Link>
        <span>→</span>
        <span className="font-medium text-gray-900">Testimonials</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="mt-2 text-gray-600">Manage customer testimonials</p>
        </div>
        <button
          onClick={() => {
            handleReset();
            setShowForm(true);
          }}
          className="rounded-lg bg-purple-500 px-4 py-2 font-medium text-white transition hover:bg-purple-600"
        >
          + New Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form - Left Column */}
        {showForm && (
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg border-l-4 border-purple-500 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                {editingId ? "Edit Testimonial" : "New Testimonial"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Tech Corp"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Role/Title *
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="CEO"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Testimonial *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What did you think about our service?"
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Featured testimonial
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-purple-500 px-4 py-2 font-medium text-white transition hover:bg-purple-600"
                  >
                    {editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Testimonials List - Right Column */}
        <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
          {testimonials.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <p className="mb-4 text-gray-500">No testimonials yet</p>
              <button
                onClick={() => {
                  handleReset();
                  setShowForm(true);
                }}
                className="rounded-lg bg-purple-500 px-4 py-2 font-medium text-white transition hover:bg-purple-600"
              >
                + Create First Testimonial
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {testimonial.author}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {testimonial.role} at {testimonial.company}
                      </p>
                      {testimonial.featured && (
                        <span className="mt-2 inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {testimonial.image && (
                    <div className="mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    </div>
                  )}

                  <p className="mb-3 text-gray-700 italic">
                    "{testimonial.content}"
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
