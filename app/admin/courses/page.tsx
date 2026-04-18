/**
 * Admin Courses Management
 * Route: /admin/courses
 * Create, edit, and delete courses
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Course } from "@/types/course";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    description: "",
    duration: "",
    price: "",
    careers: [],
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();

      if (res.ok) {
        setCourses(data.data || []);
      } else {
        toast.error("Failed to load courses");
      }
    } catch (error) {
      toast.error("Error loading courses");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration: "",
      price: "",
      careers: [],
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const startEdit = (course: Course) => {
    setFormData(course);
    setEditingId(course.id);
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title?.trim()) {
      toast.error("Course title is required");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Course description is required");
      return;
    }
    if (!formData.duration?.trim()) {
      toast.error("Duration is required");
      return;
    }
    if (!formData.price?.trim()) {
      toast.error("Price is required");
      return;
    }
    if (!formData.careers || formData.careers.length === 0) {
      toast.error("Add at least one career path");
      return;
    }

    setSubmitting(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/admin/courses/${editingId}`
        : "/api/admin/courses";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          editingId
            ? "Course updated successfully"
            : "Course created successfully",
        );
        fetchCourses();
        resetForm();
      } else {
        toast.error(data.error || "Failed to save course");
      }
    } catch (error) {
      toast.error("Error saving course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });

      if (res.ok) {
        toast.success("Course deleted successfully");
        fetchCourses();
      } else {
        toast.error("Failed to delete course");
      }
    } catch (error) {
      toast.error("Error deleting course");
    }
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
        <span className="font-medium text-gray-900">Courses</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <p className="mt-2 text-gray-600">
            Create, edit, and manage all training courses
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-orange-600"
          >
            <span>+</span>
            <span>New Course</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Course Editor */}
        {isEditing && (
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? "Edit Course" : "New Course"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-2xl leading-none text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Web Design (Frontend)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={formData.duration || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="e.g., 4 months"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Price *
                  </label>
                  <input
                    type="text"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="e.g., 150,000"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Description *
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    placeholder="Describe what students will learn..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                {/* Career Paths */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Career Paths *
                  </label>
                  <div className="space-y-2">
                    {(formData.careers || []).map((career, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={career}
                          onChange={(e) => {
                            const newCareers = [...(formData.careers || [])];
                            newCareers[idx] = e.target.value;
                            setFormData({ ...formData, careers: newCareers });
                          }}
                          placeholder="Career path"
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            const newCareers = formData.careers?.filter(
                              (_, i) => i !== idx,
                            );
                            setFormData({ ...formData, careers: newCareers });
                          }}
                          className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newCareers = [...(formData.careers || []), ""];
                        setFormData({ ...formData, careers: newCareers });
                      }}
                      className="w-full rounded-lg border-2 border-dashed border-orange-300 px-3 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
                    >
                      + Add Career Path
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={resetForm}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {submitting ? "Saving..." : "Save Course"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className={isEditing ? "lg:col-span-2" : "lg:col-span-3"}>
          {courses.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white py-12 text-center shadow-sm">
              <p className="mb-6 text-gray-600">No courses yet</p>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition hover:bg-orange-600"
                >
                  <span>+</span>
                  <span>Create Your First Course</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {course.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        {course.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                          {course.duration}
                        </span>
                        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          {course.price}
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-gray-600">
                        Careers: {course.careers.join(", ")}
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => startEdit(course)}
                        className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
