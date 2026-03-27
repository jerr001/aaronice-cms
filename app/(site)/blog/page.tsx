/**
 * Public Blog List Page
 * Route: /blog
 * Simple blog page without complex dependencies
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Aaronice Prime",
  description:
    "Read our latest blog posts about AI, technology, and digital transformation.",
};

export default function BlogPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-4 text-5xl font-bold">Blog & Insights</h1>
          <p className="text-xl text-slate-300">
            Read our latest stories about AI, technology, and digital
            transformation
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Coming Soon</h2>
          <p className="mb-8 text-lg text-gray-600">
            Our blog is currently being developed. Check back soon for exciting
            content about AI, technology, and digital transformation.
          </p>
          <div className="mt-8 rounded-lg bg-blue-50 p-8">
            <p className="text-sm text-gray-700">
              In the meantime, you can manage blog posts from the admin dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

