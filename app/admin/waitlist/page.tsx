/**
 * Admin Waitlist Page
 * View all waitlist signups
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface WaitlistSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  paymentOption?: string;
  totalAmount?: number;
  createdAt: string;
}

export default function WaitlistPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<WaitlistSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchWaitlist = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch("/api/admin/waitlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error("Failed to load waitlist");
        return;
      }

      const data = await res.json();
      setSubmissions(data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Error loading waitlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchWaitlist();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchWaitlist, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}'s waitlist signup?`)) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/waitlist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Signup deleted");
        await fetchWaitlist();
      } else {
        toast.error("Failed to delete signup");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting signup");
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Waitlist Signups</h1>
        <p className="text-gray-600">
          {submissions.length} signup{submissions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">No waitlist signups yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{submission.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    Interested
                  </span>
                  <button
                    onClick={() => handleDelete(submission.id, submission.name)}
                    className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a
                    href={`mailto:${submission.email}`}
                    className="font-medium text-orange-600 hover:text-orange-700"
                  >
                    {submission.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a
                    href={`tel:${submission.phone}`}
                    className="font-medium text-orange-600 hover:text-orange-700"
                  >
                    {submission.phone}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Course Interested In</p>
                  <p className="font-medium">{submission.course}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Option</p>
                  <p className="font-medium">
                    {submission.paymentOption || "Not specified"}
                  </p>
                </div>
              </div>

              {submission.totalAmount && (
                <div className="mt-4 border-t pt-4">
                  <p className="font-semibold text-orange-600">
                    Total Amount: ${submission.totalAmount}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/admin"
          className="font-medium text-orange-600 hover:text-orange-700"
        >
          ← Back to Admin
        </Link>
      </div>
    </div>
  );
}
