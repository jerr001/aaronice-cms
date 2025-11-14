"use client";
import Image from "next/image";
import { useState } from "react";

const Hero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="relative overflow-hidden bg-white pt-40 pb-24 md:pt-44 xl:pt-52 xl:pb-30 dark:bg-black">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="animate-blob absolute top-0 left-0 h-96 w-96 rounded-full bg-orange-100 opacity-40 mix-blend-multiply blur-3xl filter dark:opacity-10"></div>
        <div className="animate-blob animation-delay-2000 absolute top-0 right-0 h-96 w-96 rounded-full bg-orange-200 opacity-30 mix-blend-multiply blur-3xl filter dark:opacity-10"></div>
        <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/2 h-96 w-96 rounded-full bg-orange-50 opacity-40 mix-blend-multiply blur-3xl filter dark:opacity-10"></div>
      </div>

      <div className="max-w-c-1390 mx-auto px-6 sm:px-8 md:px-12 xl:px-16 2xl:px-20">
        <div className="flex flex-col-reverse items-center gap-12 md:flex-row lg:gap-16 xl:gap-24">
          {/* Left content */}
          <div className="w-full md:w-1/2">
            <h1 className="mb-6 text-4xl leading-tight font-bold text-black sm:text-5xl md:text-[55px] lg:text-6xl dark:text-white">
              <span className="inline-block animate-pulse bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Innovate.
              </span>{" "}
              <span
                className="inline-block animate-pulse bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent"
                style={{ animationDelay: "0.2s" }}
              >
                Upskill.
              </span>{" "}
              <span
                className="inline-block animate-pulse bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent"
                style={{ animationDelay: "0.4s" }}
              >
                Lead the Future.
              </span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Aaronice Prime Global Company Ltd is a leading technology company
              empowering organizations, businesses, and individuals through
              digital transformation, intelligent software solutions, and
              digital skills training offered by our tech academy led by global
              industry experts.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg"
              >
                Get a Software Solution
              </a>
              <a
                href="/#courses"
                className="inline-flex items-center justify-center rounded-full border-2 border-orange-500 bg-transparent px-8 py-4 text-base font-semibold text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-white hover:shadow-lg dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-400 dark:hover:text-white"
              >
                Explore Courses
              </a>
            </div>
          </div>

          {/* Right image */}
          <div className="w-full md:w-1/2">
            <div className="animate-float relative mx-auto aspect-[700/444] w-full max-w-[550px] sm:max-w-[400px] md:max-w-full">
              {/* Background Shapes */}
              <Image
                src="/images/shape/shape-01.png"
                alt="shape"
                width={46}
                height={246}
                className="animate-bounce-slow absolute top-0 -left-10 z-0 hidden opacity-40 md:block"
              />
              <Image
                src="/images/shape/shape-02.svg"
                alt="shape"
                width={36.9}
                height={36.7}
                className="animate-spin-slow absolute right-0 bottom-0 z-10 opacity-60"
              />
              <Image
                src="/images/shape/shape-03.svg"
                alt="shape"
                width={21.64}
                height={21.66}
                className="animate-ping-slow absolute -right-6 bottom-0 z-0 opacity-60"
              />

              {/* Hero Images */}
              <Image
                className="rounded-xl border-4 border-white object-cover shadow-2xl transition-transform duration-500 hover:scale-105 dark:hidden"
                src="/images/hero/hero-light.jpg"
                alt="Hero"
                fill
              />
              <Image
                className="hidden rounded-xl border-4 border-gray-800 object-cover shadow-2xl transition-transform duration-500 hover:scale-105 dark:block"
                src="/images/hero/hero-dark.jpg"
                alt="Hero"
                fill
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
