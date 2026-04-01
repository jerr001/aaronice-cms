/**
 * Admin Dashboard Layout
 * All /admin routes go through here
 * Provides navigation and layout structure
 */

"use client";

import "../globals.css";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(pathname !== "/admin/login");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check auth on mount (skip on login page)
  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/pages", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        router.push("/admin/login");
      } else if (res.ok) {
        setIsAuthenticated(true);
      } else {
        // For other errors, still allow display (might be a 500 error)
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("[Auth Check Error]", error);
      setIsAuthenticated(false);
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, don't show layout
  if (!isAuthenticated && pathname !== "/admin/login") {
    return null;
  }

  // Login page doesn't need layout
  if (pathname === "/admin/login") {
    return children;
  }

  // Admin layout for authenticated users
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } flex flex-col bg-slate-900 text-white transition-all duration-300`}
      >
        {/* Logo */}
        <div className="border-b border-slate-700 p-4">
          <Link href="/admin" className="text-xl font-bold text-orange-500">
            {sidebarOpen ? "Aaronice CMS" : "AC"}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            <li>
              <Link
                href="/admin"
                className={`block rounded-md px-4 py-2 transition ${
                  pathname === "/admin"
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-800"
                }`}
              >
                {sidebarOpen ? "Dashboard" : "–"}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/blog"
                className={`block rounded-md px-4 py-2 transition ${
                  pathname?.startsWith("/admin/blog") &&
                  !pathname?.startsWith("/admin/blog-comments")
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-800"
                }`}
              >
                {sidebarOpen ? "Blog Posts" : "–"}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/blog-comments"
                className={`block rounded-md px-4 py-2 transition ${
                  pathname?.startsWith("/admin/blog-comments")
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-800"
                }`}
              >
                {sidebarOpen ? "Blog Comments" : "–"}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/courses"
                className={`block rounded-md px-4 py-2 transition ${
                  pathname?.startsWith("/admin/courses")
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-800"
                }`}
              >
                {sidebarOpen ? "Courses" : "–"}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/contact-submissions"
                className={`block rounded-md px-4 py-2 transition ${
                  pathname?.startsWith("/admin/contact-submissions")
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-800"
                }`}
              >
                {sidebarOpen ? "Contact Submissions" : "–"}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/testimonials"
                className={`block rounded-md px-4 py-2 transition ${
                  pathname?.startsWith("/admin/testimonials")
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-800"
                }`}
              >
                {sidebarOpen ? "Testimonials" : "–"}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/team-members"
                className={`block rounded-md px-4 py-2 transition ${
                  pathname?.startsWith("/admin/team-members")
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-800"
                }`}
              >
                {sidebarOpen ? "Team Members" : "–"}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pages"
                className={`block rounded-md px-4 py-2 transition ${
                  pathname?.startsWith("/admin/pages")
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-800"
                }`}
              >
                {sidebarOpen ? "Pages" : "–"}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/media"
                className={`block rounded-md px-4 py-2 transition ${
                  pathname?.startsWith("/admin/media")
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-800"
                }`}
              >
                {sidebarOpen ? "Media" : "–"}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className={`block rounded-md px-4 py-2 transition ${
                  pathname?.startsWith("/admin/settings")
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-800"
                }`}
              >
                {sidebarOpen ? "Settings" : "–"}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="space-y-2 border-t border-slate-700 p-4">
          {/* Change Password Link */}
          <Link
            href="/admin/change-password"
            className="block rounded-md px-4 py-2 text-center text-sm transition hover:bg-slate-800"
          >
            {sidebarOpen ? "Change Password" : "–"}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full rounded-md p-2 text-left text-sm hover:bg-slate-800"
          >
            {sidebarOpen ? "← Collapse" : "Expand →"}
          </button>
          <button
            onClick={handleLogout}
            className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-700"
          >
            {sidebarOpen ? "Logout" : "–"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#000",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
          success: {
            style: {
              background: "#10b981",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
        }}
      />
    </div>
  );
}
