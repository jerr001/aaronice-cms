"use client";

import Image from "next/image";
import SectionHeader from "../Common/SectionHeader";
import coursesData from "./coursesData";
import Link from "next/link";

const url = process.env.NEXT_PUBLIC_COURSES_URL || "#";
 const Courses = () => {
  return (
    <>
      <section  id="courses" className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          <div className="animate_top mx-auto text-center">
            <SectionHeader
              headerInfo={{
                title: `OUR AVAILABLE COURSES`,
                subtitle: `Be an IT expert. Think About Aaronice prime.`,
                description:
                  `Explore IT professional courses tailored to real-world challenges. At Aaronic Prime, we equip future tech experts through practical, industry-focused training.`,
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
            { coursesData.map((course, index) => (
              <div
                key={index}
                className="animate_top group relative rounded-lg border border-stroke bg-white p-7.5 shadow-solid-10 dark:border-strokedark dark:bg-blacksection dark:shadow-none"
              >
                <h3 className="mb-7.5 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle3">
                  Duration:
                  <span className="text-regular text-waterloo dark:text-manatee">
                    &nbsp;{course.duration}
                  </span>
                </h3>
                <h4 className="mb-2.5 text-para2 font-medium text-orange-400 dark:text-white">
                  {course.title}
                </h4>
                <p className="">{course.description}</p>

                <div className="mt-9 border-t border-stroke pb-12.5 pt-3 dark:border-strokedark">
                  <p className="text-bold text-orange-400 dark:text-white py-2">
                    Career Opportunities
                  </p>
                  <ul>
                    {course.careers.map((career, i) => (
                      <li
                        key={i}
                        className="mb-3 text-black last:mb-0 dark:text-manatee"
                      >
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  aria-label="Get the Plan button"
                  className="group/btn inline-flex items-center gap-2.5 font-medium text-orange-400 transition-all duration-300 dark:text-white dark:hover:text-orange-400"
                >
                  <span className="duration-300 group-hover/btn:pr-2">
                      <Link href={url} > Apply Now</Link>
                   
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
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Courses;
