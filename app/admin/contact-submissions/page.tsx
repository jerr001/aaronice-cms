/**
 * Admin Contact Submissions
 * Route: /admin/contact-submissions
 * View and manage contact form submissions
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ContactSubmission } from "@/types/contact-submission";

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSubmissions();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSubmissions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/contact-submissions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setSubmissions(data.data || []);
      } else {
        toast.error("Failed to load submissions");
      }
    } catch (error) {
      toast.error("Error loading submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchSubmissions();
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, read: true });
        }
      }
    } catch (error) {
      toast.error("Error updating submission");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission permanently?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Submission deleted");
        fetchSubmissions();
        setSelectedSubmission(null);
      }
    } catch (error) {
      toast.error("Error deleting submission");
    }
  };

  const filteredSubmissions =
    filter === "unread" ? submissions.filter((s) => !s.read) : submissions;

  if (!mounted || loading) {
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
        <span className="font-medium text-gray-900">Contact Submissions</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Contact Submissions
        </h1>
        <p className="mt-2 text-gray-600">
          Manage messages from website visitors
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-1 pb-3 font-medium transition ${
            filter === "all"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          All ({submissions.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-1 pb-3 font-medium transition ${
            filter === "unread"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Unread ({submissions.filter((s) => !s.read).length})
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Submissions List */}
        <div className="lg:col-span-1">
          <div className="space-y-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {filteredSubmissions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {filter === "unread"
                  ? "No unread messages"
                  : "No submissions yet"}
              </div>
            ) : (
              filteredSubmissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() =>
                    handleMarkAsRead(submission.id).then(() =>
                      setSelectedSubmission(submission),
                    )
                  }
                  className={`w-full border-b px-4 py-3 text-left transition last:border-b-0 ${
                    selectedSubmission?.id === submission.id
                      ? "bg-orange-50"
                      : "hover:bg-gray-50"
                  } ${!submission.read ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {submission.name}
                      </p>
                      <p className="truncate text-sm text-gray-600">
                        {submission.email}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!submission.read && (
                      <div className="mt-2 ml-2 h-2 w-2 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Submission Detail */}
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              {/* Header */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedSubmission.name}
                  </h2>
                  <p className="mt-1 text-gray-600">
                    {selectedSubmission.email}
                  </p>
                  {selectedSubmission.phone && (
                    <p className="text-gray-600">{selectedSubmission.phone}</p>
                  )}
                </div>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    selectedSubmission.read
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedSubmission.read ? "Read" : "Unread"}
                </span>
              </div>

              {/* Message */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Message
                </h3>
                <div className="rounded-lg bg-gray-50 p-4 whitespace-pre-wrap text-gray-700">
                  {selectedSubmission.message}
                </div>
              </div>

              {/* Metadata */}
              <div className="mb-6 text-sm text-gray-600">
                <p>
                  Submitted:{" "}
                  {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {!selectedSubmission.read && (
                  <button
                    onClick={() => handleMarkAsRead(selectedSubmission.id)}
                    className="flex-1 rounded-lg bg-blue-100 px-4 py-2 font-medium text-blue-600 transition hover:bg-blue-200"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedSubmission.id)}
                  className="flex-1 rounded-lg bg-red-100 px-4 py-2 font-medium text-red-600 transition hover:bg-red-200"
                >
                  Delete
                </button>
              </div>

              {/* Reply Note */}
              <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                Tip: You can reply to this message by sending an email to{" "}
                <span className="font-medium">{selectedSubmission.email}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <p className="text-gray-500">
                {submissions.length === 0
                  ? "No submissions yet"
                  : "Select a submission to view details"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
