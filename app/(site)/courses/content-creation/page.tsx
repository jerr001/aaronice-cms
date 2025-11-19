import Link from "next/link";

export default function ContentCreationPage() {
  return (
    <main className="bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 pt-52 pb-20 text-white sm:pt-56 md:pt-64 lg:pt-72">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
              Content Creation Course
            </h1>
            <p className="mx-auto max-w-3xl text-lg md:text-xl">
              Master the art of creating engaging content across video,
              graphics, copywriting, and social media platforms
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Course Overview */}
              <div className="mb-12">
                <h2 className="mb-6 text-3xl font-bold text-black dark:text-white">
                  Course Overview
                </h2>
                <p className="mb-4 text-justify leading-relaxed text-gray-600 dark:text-gray-300">
                  The Content Creation course at Aaronice Prime empowers you to
                  become a versatile content creator in today's digital
                  landscape. Learn to produce compelling content that engages
                  audiences across multiple platforms and formats.
                </p>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300">
                  From video production and editing to graphic design and
                  copywriting, you'll develop a comprehensive skill set that
                  makes you indispensable in the content-driven economy. Our
                  hands-on approach ensures you graduate with a professional
                  portfolio.
                </p>
              </div>

              {/* What You'll Learn */}
              <div className="mb-12">
                <h2 className="mb-6 text-3xl font-bold text-black dark:text-white">
                  What You'll Learn
                </h2>
                <ul className="space-y-3">
                  {[
                    "Video production and editing with professional tools",
                    "Graphic design fundamentals for social media",
                    "Copywriting techniques that convert",
                    "Content strategy and planning",
                    "Photography and photo editing basics",
                    "Podcast production and audio editing",
                    "Social media content optimization",
                    "Building and monetizing a content brand",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-orange-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curriculum Snapshot */}
              <div className="mb-12">
                <h2 className="mb-6 text-3xl font-bold text-black dark:text-white">
                  Curriculum Snapshot
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      week: "Weeks 1-2",
                      topic: "Content Strategy & Planning Fundamentals",
                    },
                    {
                      week: "Weeks 3-4",
                      topic: "Video Production & Editing Mastery",
                    },
                    {
                      week: "Weeks 5-6",
                      topic: "Graphic Design for Social Media",
                    },
                    {
                      week: "Weeks 7-8",
                      topic: "Copywriting & Storytelling Techniques",
                    },
                    {
                      week: "Weeks 9-10",
                      topic: "Photography, Audio & Multi-Format Content",
                    },
                    {
                      week: "Weeks 11-12",
                      topic: "Portfolio Development & Content Monetization",
                    },
                  ].map((module, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <h3 className="font-semibold text-orange-500">
                        {module.week}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {module.topic}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <div className="mb-12">
                <h2 className="mb-6 text-3xl font-bold text-black dark:text-white">
                  What Our Students Say
                </h2>
                <div className="space-y-6">
                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <p className="mb-4 text-gray-600 italic dark:text-gray-300">
                      "I went from zero to content creator hero! This course
                      gave me all the tools I needed to start my YouTube
                      channel."
                    </p>
                    <p className="font-semibold text-black dark:text-white">
                      — Blessing E., Content Creator
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <p className="mb-4 text-gray-600 italic dark:text-gray-300">
                      "The skills I learned here helped me land multiple
                      freelance clients. Best investment in my creative career!"
                    </p>
                    <p className="font-semibold text-black dark:text-white">
                      — David N., Freelance Creator
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Course Info Card */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                    Course Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Duration
                      </p>
                      <p className="font-semibold text-black dark:text-white">
                        3 Months
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Price
                      </p>
                      <p className="text-2xl font-bold text-orange-500">
                        ₦80,000
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Format
                      </p>
                      <p className="font-semibold text-black dark:text-white">
                        Online & In-Person
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Level
                      </p>
                      <p className="font-semibold text-black dark:text-white">
                        Beginner to Advanced
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/waitlist?course=content-creation"
                    className="mt-6 block w-full rounded-lg bg-orange-500 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
                  >
                    Apply Now
                  </Link>
                </div>

                {/* Contact Card */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-4 text-lg font-bold text-black dark:text-white">
                    Have Questions?
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    Contact us for more information about this course
                  </p>
                  <a
                    href="tel:+2348024727665"
                    className="flex items-center gap-2 text-orange-500 hover:text-orange-600"
                  >
                    +234 802 472 7665
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
