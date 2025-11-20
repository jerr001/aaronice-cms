"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentCancelled() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to waitlist after 5 seconds
    const timeout = setTimeout(() => {
      router.push("/waitlist");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="bg-white dark:bg-black">
      <section className="relative bg-gradient-to-r from-red-500 to-red-600 pt-52 pb-20 text-white sm:pt-56 md:pt-60 lg:pt-64">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8">
            <svg
              className="mx-auto h-24 w-24 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Payment Cancelled
          </h1>
          <p className="mb-8 text-lg md:text-xl">
            Your payment was cancelled. No charges have been made to your
            account.
          </p>
          <p className="mb-12 text-base opacity-90">
            You'll be redirected to the waitlist page in 5 seconds...
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Link
              href="/waitlist"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-red-500 transition-all duration-300 hover:bg-gray-100"
            >
              Return to Waitlist
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-white hover:text-red-500"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
              Need Help?
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              If you encountered any issues during the payment process or have
              questions about our courses, feel free to contact us.
            </p>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-300">
                <strong className="text-black dark:text-white">Email:</strong>{" "}
                <a
                  href="mailto:support@aaronice.com"
                  className="text-orange-500 hover:text-orange-600"
                >
                  support@aaronice.com
                </a>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong className="text-black dark:text-white">Phone:</strong>{" "}
                <a
                  href="tel:+2348024727665"
                  className="text-orange-500 hover:text-orange-600"
                >
                  +234 802 472 7665
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
