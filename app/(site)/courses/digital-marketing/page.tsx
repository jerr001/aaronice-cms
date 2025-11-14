import Link from "next/link";

export default function DigitalMarketingPage() {
  return (
    <main className="bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 pt-32 pb-20 text-white md:pt-36 lg:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
              Digital Marketing Course
            </h1>
            <p className="mx-auto max-w-3xl text-lg md:text-xl">
              Master SEO, social media marketing, email campaigns, and
              data-driven strategies to grow brands online
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
                  The Digital Marketing course at Aaronice Prime prepares you to
                  navigate the dynamic world of online marketing. Learn to
                  create and manage effective marketing campaigns across
                  multiple channels, analyze performance metrics, and optimize
                  strategies for maximum ROI.
                </p>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300">
                  From SEO and content marketing to social media advertising and
                  email automation, you'll gain hands-on experience with
                  industry-standard tools and platforms. Our curriculum is
                  designed to help you build a comprehensive skill set that
                  employers value.
                </p>
              </div>

              {/* What You'll Learn */}
              <div className="mb-12">
                <h2 className="mb-6 text-3xl font-bold text-black dark:text-white">
                  What You'll Learn
                </h2>
                <ul className="space-y-3">
                  {[
                    "Search Engine Optimization (SEO) fundamentals and advanced techniques",
                    "Social media marketing strategies across major platforms",
                    "Content marketing and copywriting essentials",
                    "Email marketing automation and campaign management",
                    "Pay-per-click (PPC) advertising with Google Ads and Facebook Ads",
                    "Analytics and data-driven decision making",
                    "Conversion rate optimization techniques",
                    "Building and managing digital marketing campaigns",
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
                      topic: "Introduction to Digital Marketing & SEO Basics",
                    },
                    {
                      week: "Weeks 3-4",
                      topic: "Social Media Marketing & Content Strategy",
                    },
                    {
                      week: "Weeks 5-6",
                      topic: "Email Marketing & Marketing Automation",
                    },
                    {
                      week: "Weeks 7-8",
                      topic: "PPC Advertising & Google Ads Mastery",
                    },
                    {
                      week: "Weeks 9-10",
                      topic: "Analytics, Metrics & Campaign Optimization",
                    },
                    {
                      week: "Weeks 11-12",
                      topic: "Capstone Project & Portfolio Development",
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
                      "The Digital Marketing course gave me the confidence to
                      launch my own marketing agency. The instructors are
                      amazing!"
                    </p>
                    <p className="font-semibold text-black dark:text-white">
                      — Tunde O., Marketing Manager
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <p className="mb-4 text-gray-600 italic dark:text-gray-300">
                      "I landed my dream job as a Social Media Strategist just 2
                      months after completing this course. Best investment
                      ever!"
                    </p>
                    <p className="font-semibold text-black dark:text-white">
                      — Chioma A., Social Media Strategist
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
                        ₦100,000
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
                    href="/waitlist?course=digital-marketing"
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
