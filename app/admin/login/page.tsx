/**
 * Admin login page
 * Route: /admin/login
 * Public page (no auth required)
 */

"use client";

import "../../globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        toast.error(data.error || "Login failed");
        return;
      }

      if (data.data?.token) {
        // Store token in localStorage for client-side API calls
        localStorage.setItem("adminToken", data.data.token);
        console.log("✓ Token stored in localStorage");

        // Token will also be in httpOnly cookie automatically
        toast.success("Login successful!");
        router.push("/admin");
        router.refresh();
      } else {
        setError("No token received from server");
        toast.error("Login failed - no token received");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          {/* Header with accent */}
          <div className="border-b-4 border-orange-500 bg-white px-8 py-10 text-center">
            <div className="mx-auto mb-4">
              <Image
                src="/images/logo/banner-light.png"
                alt="Aaronice Prime Logo"
                width={200}
                height={60}
                className="mx-auto h-auto w-auto"
                priority
              />
            </div>
            <p className="text-sm font-medium tracking-wide text-gray-500">
              ADMIN PORTAL
            </p>
          </div>

          {/* Form Container */}
          <div className="px-8 py-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                <div className="flex items-center gap-2">
                  <span className="text-lg">!</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aaronice.com"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-xs text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            {/* Footer Links */}
            <div className="space-y-3 text-center text-sm text-gray-600">
              <p>
                <Link
                  href="/admin/forgot-password"
                  className="font-medium text-orange-500 transition-colors hover:text-orange-600"
                >
                  Forgot Password?
                </Link>
              </p>
              <p>
                <Link
                  href="/"
                  className="font-medium text-orange-500 transition-colors hover:text-orange-600"
                >
                  ← Back to Website
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="border-t border-gray-100 bg-gray-50 px-8 py-4 text-center text-xs text-gray-500">
            <p>
              Need help? Contact the administrator or visit the documentation.
            </p>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-gray-400">
            Aaronice Prime Global Company Ltd
          </p>
        </div>
      </div>
    </div>
  );
}
