"use client";

import Image from "next/image";
import SectionHeader from "../Common/SectionHeader";
import coursesData from "./coursesData";
import Link from "next/link";

const url = process.env.NEXT_PUBLIC_COURSES_URL || "#";
const Courses = () => {
  // Map course titles to their URL slugs
  const getCourseSlug = (title: string): string => {
    const slugMap: { [key: string]: string } = {
      "Web Design (Frontend)": "frontend",
      "Data Analysis": "data-analysis",
      "Product Design": "product-design",
      "AI Automation": "ai-automation",
      "Digital Marketing": "digital-marketing",
      "Project Management": "project-management",
      "Graphic Design": "graphic-design",
      "Content Creation": "content-creation",
      "Virtual Assistant": "virtual-assistant",
    };
    return slugMap[title] || "";
  };

  return (
    <>
      <section
        id="courses"
        className="overflow-hidden pt-15 pb-20 lg:pb-25 xl:pb-30"
      >
        <div className="max-w-c-1315 mx-auto px-4 md:px-8 xl:px-0">
          <div className="animate_top mx-auto text-center">
            <SectionHeader
              headerInfo={{
                title: `OUR AVAILABLE COURSES`,
                subtitle: `Be an IT expert. Think About Aaronice Prime.`,
                description: `Explore IT professional courses tailored to real-world challenges. At Aaronic Prime, we equip future tech experts through practical, industry-focused training.`,
              }}
            />
          </div>
        </div>

        <div className="relative mx-auto mt-15 max-w-[1207px] px-4 md:px-8 xl:mt-20 xl:px-0">
          <div className="absolute -bottom-15 -z-1 h-full w-full">
            <Image
              fill
              src="/images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 xl:gap-10">
            {coursesData.map((course, index) => (
              <Link
                key={index}
                href={`/courses/${getCourseSlug(course.title)}`}
                className="animate_top group border-stroke dark:border-strokedark dark:bg-blacksection relative flex h-full cursor-pointer flex-col rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-2xl focus:ring-2 focus:ring-orange-500 focus:outline-none dark:shadow-none"
              >
                <h4 className="mb-4 text-xl font-bold text-orange-500 dark:text-white">
                  {course.title}
                </h4>

                <p className="mb-6 text-justify text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  {course.description}
                </p>

                <div className="mb-3 text-base text-black dark:text-white">
                  <strong>Price:</strong>
                  <span className="ml-2 text-xl font-bold text-orange-600 dark:text-orange-400">
                    &#8358; {course.price}
                  </span>
                </div>

                <div className="mb-6 text-base text-black dark:text-white">
                  <strong>Duration:</strong>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {course.duration}
                  </span>
                </div>

                <div className="border-stroke dark:border-strokedark mt-auto border-t pt-5">
                  <span className="group/btn mt-4 inline-flex items-center gap-2.5 font-semibold text-orange-500 transition-all duration-300 dark:text-white dark:hover:text-orange-400">
                    <span className="duration-300 group-hover/btn:pr-2">
                      View Details
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Courses;
