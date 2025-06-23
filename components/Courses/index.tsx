"use client";

import Image from "next/image";
import SectionHeader from "../Common/SectionHeader";
import coursesData from "./coursesData";
import Link from "next/link";

const url = process.env.NEXT_PUBLIC_COURSES_URL || "#";
 const Courses = () => {
  return (
    <>
     <section id="courses" className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
  <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
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
        src="./images/shape/shape-dotted-light.svg"
        alt="Dotted"
        className="dark:hidden"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-7.5 xl:gap-12.5">
      {coursesData.map((course, index) => (
        <div
          key={index}
          className="animate_top group relative flex flex-col h-full rounded-lg border border-stroke bg-white p-7.5 shadow-solid-10 dark:border-strokedark dark:bg-blacksection dark:shadow-none"
        >
          <h4 className="mb-4 text-lg font-semibold text-orange-400 dark:text-white">
            {course.title}
          </h4>

          <p className="mb-6 text-sm text-gray-600 dark:text-gray-300 text-justify leading-relaxed">
            {course.description}
          </p>

           <div className="mb-3 text-sm text-black dark:text-white">
      <strong>Price:</strong>
  <span className="ml-1 font-bold text-lg text-waterloo dark:text-manatee">
    &#8358; {course.price}
  </span>
</div>
          {/* <div className="mb-3 text-sm text-black dark:text-white">
            <strong>Price:</strong>
            <span className="ml-1 text-waterloo dark:text-manatee">
              &#8358; {course.price}
            </span>
          </div> */}

          <div className="mb-6 text-sm text-black dark:text-white">
            <strong>Duration:</strong>
            <span className="ml-1 text-waterloo dark:text-manatee">
              {course.duration}
            </span>
          </div>

          <div className="mt-auto pt-4 border-t border-stroke dark:border-strokedark">
            <button
              aria-label="Get the Plan button"
              className="group/btn mt-4 inline-flex items-center gap-2.5 font-medium text-orange-400 transition-all duration-300 dark:text-white dark:hover:text-orange-400"
            >
              <span className="duration-300 group-hover/btn:pr-2">
                <Link href={url}>Apply Now</Link>
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
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

    </>
  );
};

export default Courses;
