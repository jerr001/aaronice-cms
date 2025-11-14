"use client";
import Image from "next/image";
import SectionHeader from "../Common/SectionHeader";

const Pricing = () => {
  return (
    <>
      {/* <!-- ===== Pricing Table Start ===== --> */}
      <section className="overflow-hidden pt-15 pb-20 lg:pb-25 xl:pb-30">
        <div className="max-w-c-1315 mx-auto px-4 md:px-8 xl:px-0">
          {/* <!-- Section Title Start --> */}
          <div className="animate_top mx-auto text-center">
            <SectionHeader
              headerInfo={{
                title: `OUR AVAILABLE COURSES`,
                subtitle: `Be an IT expert. Think About Aaronice prime.`,
                description: `Explore our range of IT professional courses designed to equip you with the skills needed to solve real-world problems. At Aaronic Prime, we train and nurture the next generation of tech professionals through hands-on, industry-relevant learning.`,
              }}
            />
          </div>
          {/* <!-- Section Title End --> */}
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
          <div className="flex flex-wrap justify-center gap-7.5 lg:flex-nowrap xl:gap-12.5">
            {/* <!-- Pricing Item --> */}
            <div className="animate_top group border-stroke shadow-solid-10 dark:border-strokedark dark:bg-blacksection relative rounded-lg border bg-white p-7.5 md:w-[45%] lg:w-1/3 xl:p-12.5 dark:shadow-none">
              <h3 className="xl:text-sectiontitle3 mb-7.5 text-3xl font-bold text-black dark:text-white">
                Duration:
                <span className="text-regular text-waterloo dark:text-manatee">
                  &nbsp; 6 months
                </span>
              </h3>
              <h4 className="text-para2 mb-2.5 font-medium text-orange-400 dark:text-white">
                AI Automation
              </h4>
              <p className="">
                {" "}
                Learn the foundations of artificial intelligence and how to
                build automated systems using tools like Python and cloud
                services. This course focuses on real-world automation solutions
                across industries.{" "}
              </p>

              <div className="border-stroke dark:border-strokedark mt-9 border-t pt-3 pb-12.5">
                <p className="text-bold py-2 text-orange-400 dark:text-white">
                  Career Opportunities
                </p>
                <ul>
                  <li className="dark:text-manatee mb-3 text-black last:mb-0">
                    AI developers
                  </li>
                  <li className="dark:text-manatee mb-3 text-black last:mb-0">
                    Automation engineers
                  </li>
                  <li className="dark:text-manatee mb-3 text-black last:mb-0">
                    Machine learning specialists
                  </li>
                </ul>
              </div>

              <button
                aria-label="Get the Plan button"
                className="group/btn inline-flex items-center gap-2.5 font-medium text-orange-400 transition-all duration-300 dark:text-white dark:hover:text-orange-400"
              >
                <span className="duration-300 group-hover/btn:pr-2">
                  Subscribe Now
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

            {/* <!-- Pricing Item --> */}
            <div className="animate_top group border-stroke shadow-solid-10 dark:border-strokedark dark:bg-blacksection relative rounded-lg border bg-white p-7.5 md:w-[45%] lg:w-1/3 xl:p-12.5 dark:shadow-none">
              <div className="bg-primary text-metatitle absolute top-7.5 -right-3.5 -rotate-90 rounded-tl-full rounded-bl-full px-4.5 py-1.5 font-medium text-white uppercase">
                popular
              </div>

              <h3 className="xl:text-sectiontitle3 mb-7.5 text-3xl font-bold text-black dark:text-white">
                $59{" "}
                <span className="text-regular text-waterloo dark:text-manatee">
                  /month
                </span>
              </h3>
              <h4 className="text-para2 mb-2.5 font-medium text-black dark:text-white">
                Medium Pack
              </h4>
              <p>Lorem ipsum dolor sit amet, consec adipisicing elit.</p>

              <div className="border-stroke dark:border-strokedark mt-9 border-t pt-9 pb-12.5">
                <ul>
                  <li className="dark:text-manatee mb-4 text-black last:mb-0">
                    300 GB Storage
                  </li>
                  <li className="dark:text-manatee mb-4 text-black last:mb-0">
                    Unlimited Photos and Videos
                  </li>
                  <li className="dark:text-manatee mb-4 text-black last:mb-0">
                    Exclusive Support
                  </li>
                  <li className="dark:text-manatee mb-4 text-black opacity-40 last:mb-0">
                    Custom Branding Strategy
                  </li>
                </ul>
              </div>

              <button
                aria-label="Get the Plan button"
                className="group/btn text-primary dark:hover:text-primary inline-flex items-center gap-2.5 font-medium transition-all duration-300 dark:text-white"
              >
                <span className="duration-300 group-hover/btn:pr-2">
                  Get the Plan
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

            {/* <!-- Pricing Item --> */}
            <div className="animate_top group border-stroke shadow-solid-10 dark:border-strokedark dark:bg-blacksection relative rounded-lg border bg-white p-7.5 md:w-[45%] lg:w-1/3 xl:p-12.5 dark:shadow-none">
              <h3 className="xl:text-sectiontitle3 mb-7.5 text-3xl font-bold text-black dark:text-white">
                $189{" "}
                <span className="text-regular text-waterloo dark:text-manatee">
                  /month
                </span>
              </h3>
              <h4 className="text-para2 mb-2.5 font-medium text-black dark:text-white">
                Large Pack
              </h4>
              <p>Lorem ipsum dolor sit amet, consec adipisicing elit.</p>

              <div className="border-stroke dark:border-strokedark mt-9 border-t pt-9 pb-12.5">
                <ul>
                  <li className="dark:text-manatee mb-4 text-black last:mb-0">
                    300 GB Storage
                  </li>
                  <li className="dark:text-manatee mb-4 text-black last:mb-0">
                    Unlimited Photos and Videos
                  </li>
                  <li className="dark:text-manatee mb-4 text-black last:mb-0">
                    Exclusive Support
                  </li>
                  <li className="dark:text-manatee mb-4 text-black last:mb-0">
                    Custom Branding Strategy
                  </li>
                </ul>
              </div>

              <button
                aria-label="Get the Plan button"
                className="group/btn text-primary dark:hover:text-primary inline-flex items-center gap-2.5 font-medium transition-all duration-300 dark:text-white"
              >
                <span className="duration-300 group-hover/btn:pr-2">
                  Get the Plan
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
        </div>
      </section>
      {/* <!-- ===== Pricing Table End ===== --> */}
    </>
  );
};

export default Pricing;
