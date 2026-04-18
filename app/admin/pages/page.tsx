/**
 * Admin Pages Editor - Content-Aware
 * Route: /admin/pages
 * Edit site pages with fields matching page-specific content
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { RichEditor } from "@/components/Admin/RichEditor";
import { PageContent } from "@/lib/db/models";
import { PageId } from "@/types/page-content";

const PAGES = {
  home: {
    id: "home",
    label: "Home",
    description: "Main landing page with all sections",
  },
  about: {
    id: "about",
    label: "About",
    description: "Company information, vision, and mission",
  },
  contact: {
    id: "contact",
    label: "Contact",
    description: "Contact form and company contact information",
  },
  pricing: {
    id: "pricing",
    label: "Pricing",
    description: "Pricing plans and service tiers",
  },
  services: {
    id: "services",
    label: "Services",
    description: "Our services and offerings",
  },
  footer: {
    id: "footer",
    label: "Footer",
    description: "Footer content and links",
  },
} as const;

const PAGE_IDS = Object.values(PAGES);

// Render page-specific form fields
function renderPageContent(
  pageId: PageId,
  formData: any,
  setFormData: Function,
) {
  const commonFields = (
    <>
      {/* SEO Settings */}
      <div className="rounded-lg border-l-4 border-l-purple-500 bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-bold text-gray-900">SEO Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Page Title (60 chars)
            </label>
            <input
              type="text"
              value={formData.seoTitle || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seoTitle: e.target.value.slice(0, 60),
                })
              }
              maxLength={60}
              placeholder="SEO title for search engines"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.seoTitle?.length || 0}/60
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Meta Description (160 chars)
            </label>
            <textarea
              value={formData.seoDescription || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seoDescription: e.target.value.slice(0, 160),
                })
              }
              maxLength={160}
              rows={3}
              placeholder="Brief description for search results"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.seoDescription?.length || 0}/160
            </p>
          </div>
        </div>
      </div>
    </>
  );

  switch (pageId) {
    case "about":
      return (
        <>
          {/* About Intro */}
          <div className="rounded-lg border-l-4 border-l-blue-500 bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              About Company
            </h2>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Company Introduction
            </label>
            <RichEditor
              value={formData.aboutIntro || ""}
              onChange={(content) =>
                setFormData({ ...formData, aboutIntro: content })
              }
              placeholder="Tell the story of your company..."
            />
          </div>

          {/* Vision */}
          <div className="rounded-lg border-l-4 border-l-green-500 bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Vision Statement
            </label>
            <RichEditor
              value={formData.visionStatement || ""}
              onChange={(content) =>
                setFormData({ ...formData, visionStatement: content })
              }
              placeholder="What is your company's vision for the future?"
            />
          </div>

          {/* Mission */}
          <div className="rounded-lg border-l-4 border-l-yellow-500 bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Mission Statement
            </label>
            <RichEditor
              value={formData.missionStatement || ""}
              onChange={(content) =>
                setFormData({ ...formData, missionStatement: content })
              }
              placeholder="What is your company's mission?"
            />
          </div>

          {commonFields}
        </>
      );

    case "contact":
      return (
        <>
          {/* Contact Heading */}
          <div className="rounded-lg border-l-4 border-l-blue-500 bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Page Heading
            </label>
            <input
              type="text"
              value={formData.contactHeading || ""}
              onChange={(e) =>
                setFormData({ ...formData, contactHeading: e.target.value })
              }
              placeholder="Get in Touch"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Contact Description */}
          <div className="rounded-lg border-l-4 border-l-blue-500 bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Contact Description
            </label>
            <textarea
              value={formData.contactDescription || ""}
              onChange={(e) =>
                setFormData({ ...formData, contactDescription: e.target.value })
              }
              rows={3}
              placeholder="Tell visitors how to contact you..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Contact Info */}
          <div className="rounded-lg border-l-4 border-l-orange-500 bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  placeholder="contact@aaronice.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                  placeholder="+234 (0) XXX XXXX XXX"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Address
                </label>
                <textarea
                  value={formData.contactAddress || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contactAddress: e.target.value })
                  }
                  rows={3}
                  placeholder="Your business address..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {commonFields}
        </>
      );

    case "pricing":
      return (
        <>
          {/* Pricing Intro */}
          <div className="rounded-lg border-l-4 border-l-blue-500 bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Pricing Page Introduction
            </label>
            <RichEditor
              value={formData.pricingIntro || ""}
              onChange={(content) =>
                setFormData({ ...formData, pricingIntro: content })
              }
              placeholder="Introduce your pricing plans..."
            />
          </div>

          {/* Pricing Highlight */}
          <div className="rounded-lg border-l-4 border-l-orange-500 bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Special Offer or Highlight
            </label>
            <input
              type="text"
              value={formData.pricingHighlight || ""}
              onChange={(e) =>
                setFormData({ ...formData, pricingHighlight: e.target.value })
              }
              placeholder="e.g., Save 20% with annual billing"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {commonFields}
        </>
      );

    case "home":
    default:
      return (
        <>
          {/* Hero Title */}
          <div className="rounded-lg border-l-4 border-l-blue-500 bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Hero Title
            </label>
            <input
              type="text"
              value={formData.heroTitle || ""}
              onChange={(e) =>
                setFormData({ ...formData, heroTitle: e.target.value })
              }
              placeholder="Welcome to Aaronice Prime"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Hero Subtitle */}
          <div className="rounded-lg border-l-4 border-l-blue-500 bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Hero Subtitle
            </label>
            <textarea
              value={formData.heroSubtitle || ""}
              onChange={(e) =>
                setFormData({ ...formData, heroSubtitle: e.target.value })
              }
              rows={2}
              placeholder="Tagline or call to action..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Main Content */}
          <div className="rounded-lg border-l-4 border-l-green-500 bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Main Content
            </label>
            <RichEditor
              value={formData.mainContent || ""}
              onChange={(content) =>
                setFormData({ ...formData, mainContent: content })
              }
              placeholder="Home page content..."
            />
          </div>

          {commonFields}
        </>
      );
  }
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Record<PageId, PageContent | null>>(
    {} as any,
  );
  const [selectedPageId, setSelectedPageId] = useState<PageId>("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<PageContent>>({});

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (selectedPageId && pages[selectedPageId]) {
      setFormData(pages[selectedPageId] || {});
    } else {
      setFormData({
        pageId: selectedPageId,
      });
    }
  }, [selectedPageId, pages]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();

      if (res.ok) {
        const pagesMap: any = {};
        (data.data || []).forEach((page: PageContent) => {
          pagesMap[page.pageId] = page;
        });
        setPages(pagesMap);
      } else {
        toast.error("Failed to load pages");
      }
    } catch (error) {
      toast.error("Error loading pages");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        pageId: selectedPageId,
      };

      console.log("[PageEditor] Saving page:", selectedPageId, payload);

      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("[PageEditor] Save response:", res.status, data);

      if (res.ok && data.success) {
        toast.success("✅ Page saved successfully!");

        // Update the pages state with the saved data
        const savedPage = data.data || formData;
        setPages({
          ...pages,
          [selectedPageId]: savedPage,
        });

        console.log("[PageEditor] Page updated in state:", selectedPageId);
      } else {
        const errorMsg = data.error || data.message || "Failed to save page";
        console.error("[PageEditor] Save failed:", errorMsg);
        toast.error(`❌ ${errorMsg}`);
      }
    } catch (error) {
      console.error("[PageEditor] Save error:", error);
      toast.error(
        "❌ Error saving page: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const currentPage = PAGES[selectedPageId];

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/admin" className="transition hover:text-orange-500">
          Dashboard
        </Link>
        <span>→</span>
        <span className="font-medium text-gray-900">Pages</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Pages</h1>
          <p className="mt-2 text-gray-600">
            Update content for each page on your website
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-orange-500 px-6 py-2 font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Page Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-700 uppercase">
              Pages
            </h3>
            {PAGE_IDS.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPageId(page.id as PageId)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  selectedPageId === page.id
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                title={page.description}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>

        {/* Page Content Editor */}
        <div className="space-y-6 lg:col-span-3">
          {/* Current Page Info */}
          <div className="rounded-lg border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              {currentPage?.label}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {currentPage?.description}
            </p>
          </div>

          {/* Dynamic Form Fields Based on Page Type */}
          {renderPageContent(selectedPageId, formData, setFormData)}

          {/* Save Button Footer */}
          <div className="flex justify-end rounded-lg bg-gray-50 p-6 shadow-sm">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-orange-500 px-8 py-2 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving ? "Saving All Changes..." : "Save All Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
