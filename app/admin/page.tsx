/**
 * Admin Dashboard Home
 * Route: /admin
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  pages: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchStats = useCallback(async (token: string) => {
    if (!token) {
      console.error("No token available for stats fetch");
      setLoading(false);
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      console.log("[Stats] Fetching dashboard stats...");

      // Fetch blog stats with max allowed limit (API max is 100)
      let blogData = { data: [], total: 0 };
      let blogRes: Response | null = null;
      try {
        blogRes = await fetch("/api/admin/blog?page=1&limit=100", {
          headers,
        });
        if (!blogRes.ok) {
          console.error(
            "[Stats] Blog API error:",
            blogRes.status,
            blogRes.statusText,
          );
        } else {
          blogData = await blogRes.json();
        }
      } catch (error) {
        console.error("[Stats] Failed to fetch blog stats:", error);
        toast.error("Failed to fetch blog stats");
      }

      // Fetch pages stats
      let pagesData = { data: [] };
      let pagesRes: Response | null = null;
      try {
        pagesRes = await fetch("/api/admin/pages", {
          headers,
        });
        if (!pagesRes.ok) {
          console.error(
            "[Stats] Pages API error:",
            pagesRes.status,
            pagesRes.statusText,
          );
        } else {
          pagesData = await pagesRes.json();
        }
      } catch (error) {
        console.error("[Stats] Failed to fetch pages stats:", error);
        toast.error("Failed to fetch pages stats");
      }

      // Update stats from successful responses
      if (blogRes?.ok && pagesRes?.ok) {
        const posts = blogData.data || [];
        const publishedCount = posts.filter(
          (p: any) => p.status === "published",
        ).length;
        const draftCount = posts.filter(
          (p: any) => p.status === "draft",
        ).length;

        setStats({
          totalPosts: blogData.total || 0,
          publishedPosts: publishedCount,
          draftPosts: draftCount,
          pages: (pagesData.data || []).length,
        });
      }
    } catch (error) {
      console.error("[Stats] Unexpected error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Mark as mounted so we can access localStorage
    setMounted(true);

    // Get token
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.warn("No auth token found, redirecting to login");
      setLoading(false);
      router.push("/admin/login");
      return;
    }

    // Fetch stats
    fetchStats(token);

    // Refresh stats every 10 seconds
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("adminToken");
      if (currentToken) {
        fetchStats(currentToken);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  if (!mounted) {
    return null; // Don't render until mounted to avoid hydration mismatch
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const handleRefresh = () => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      fetchStats(token);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to the Aaronice CMS</p>
        </div>
        <button
          onClick={handleRefresh}
          className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Total Posts */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalPosts}
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <span className="text-xl font-bold">P</span>
            </div>
          </div>
        </div>

        {/* Published */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.publishedPosts}
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <span className="text-xl font-bold">✓</span>
            </div>
          </div>
        </div>

        {/* Drafts */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.draftPosts}
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <span className="text-xl font-bold">D</span>
            </div>
          </div>
        </div>

        {/* Pages */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pages</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.pages}
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <span className="text-xl font-bold">P</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu & Quick Actions */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Content Menu */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Content</h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/admin/blog/create"
                className="flex items-center font-medium text-orange-500 hover:text-orange-600"
              >
                Create Post
              </Link>
            </li>
            <li>
              <Link
                href="/admin/blog"
                className="flex items-center font-medium text-orange-500 hover:text-orange-600"
              >
                All Posts
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pages"
                className="flex items-center font-medium text-orange-500 hover:text-orange-600"
              >
                Pages
              </Link>
            </li>
            <li>
              <Link
                href="/admin/media"
                className="flex items-center font-medium text-orange-500 hover:text-orange-600"
              >
                Media
              </Link>
            </li>
          </ul>
        </div>

        {/* Submissions Menu */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Submissions</h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/admin/contact-submissions"
                className="flex items-center font-medium text-orange-500 hover:text-orange-600"
              >
                Contact Messages
              </Link>
            </li>
            <li>
              <Link
                href="/admin/waitlist"
                className="flex items-center font-medium text-orange-500 hover:text-orange-600"
              >
                Waitlist Signups
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center font-medium text-orange-500 hover:text-orange-600"
              >
                Site Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Help & Resources */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Resources</h2>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Blog Posts:</strong> Create and publish rich content with
              the built-in editor.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Pages:</strong> Edit content on key pages like Home,
              About, and Contact.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Media:</strong> Upload images to use in posts and pages.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>SEO:</strong> Each post and page has SEO fields for better
              search visibility.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
