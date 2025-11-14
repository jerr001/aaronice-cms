"use client";
import Image from "next/image";
import { useState } from "react";
import FeaturesTabItem from "./FeaturesTabItem";
import featuresTabData from "./featuresTabData";
import SectionHeader from "../Common/SectionHeader";

import { motion } from "framer-motion";

const FeaturesTab = () => {
  const [currentTab, setCurrentTab] = useState("tabOne");

  return (
    <>
      <section className="relative bg-white pt-18.5 pb-20 lg:pb-22.5 dark:bg-black">
        <div className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.01]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='%23f97316' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <SectionHeader
          headerInfo={{
            title: "OUR PROJECTS",
            subtitle: "Innovative IT Solutions That Power Progress",
            description: `We create smart IT solutions that meet global standards and drive real impact for businesses and communities.`,
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 pt-5 sm:px-8 md:px-12 xl:px-16 2xl:px-20">
          <div className="absolute -top-16 -z-1 mx-auto h-[350px] w-[90%]">
            <Image
              fill
              className="dark:hidden"
              src="/images/shape/shape-dotted-light.svg"
              alt="Dotted Shape"
            />
            <Image
              fill
              className="hidden dark:block"
              src="/images/shape/shape-dotted-dark.svg"
              alt="Dotted Shape"
            />
          </div>

          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: -20,
              },

              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top border-stroke shadow-solid-5 dark:border-strokedark dark:bg-blacksection dark:shadow-solid-6 mb-15 flex flex-wrap justify-center rounded-[10px] border bg-white md:flex-nowrap md:items-center lg:gap-7.5 xl:mb-21.5 xl:gap-12.5"
          >
            <div
              onClick={() => setCurrentTab("tabOne")}
              className={`border-stroke dark:border-strokedark relative flex w-full cursor-pointer items-center gap-4 border-b px-6 py-2 last:border-0 md:w-auto md:border-0 xl:px-13.5 xl:py-5 ${
                currentTab === "tabOne"
                  ? "active before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:rounded-tl-[4px] before:rounded-tr-[4px] before:bg-orange-400"
                  : ""
              }`}
            >
              <div className="border-stroke dark:border-strokedark dark:bg-blacksection flex h-12.5 w-12.5 items-center justify-center rounded-[50%] border">
                <p className="text-metatitle3 font-medium text-black dark:text-white">
                  01
                </p>
              </div>
              <div className="md:w-3/5 lg:w-auto">
                <button className="text-xs font-medium text-black dark:text-white">
                  University Portal Development & Deployment
                </button>
              </div>
            </div>
            <div
              onClick={() => setCurrentTab("tabTwo")}
              className={`border-stroke dark:border-strokedark relative flex w-full cursor-pointer items-center gap-4 border-b px-6 py-2 last:border-0 md:w-auto md:border-0 xl:px-13.5 xl:py-5 ${
                currentTab === "tabTwo"
                  ? "active before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:rounded-tl-[4px] before:rounded-tr-[4px] before:bg-orange-400"
                  : ""
              }`}
            >
              <div className="border-stroke dark:border-strokedark dark:bg-blacksection flex h-12.5 w-12.5 items-center justify-center rounded-[50%] border">
                <p className="text-metatitle3 font-medium text-black dark:text-white">
                  02
                </p>
              </div>
              <div className="md:w-3/5 lg:w-auto">
                <button className="text-xs font-medium text-black dark:text-white">
                  Scalable Cloud-Native Infrastructure for FinSecAfrica
                </button>
              </div>
            </div>
            <div
              onClick={() => setCurrentTab("tabThree")}
              className={`border-stroke dark:border-strokedark relative flex w-full cursor-pointer items-center gap-4 border-b px-6 py-2 last:border-0 md:w-auto md:border-0 xl:px-13.5 xl:py-5 ${
                currentTab === "tabThree"
                  ? "active before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:rounded-tl-[4px] before:rounded-tr-[4px] before:bg-orange-400"
                  : ""
              }`}
            >
              <div className="border-stroke dark:border-strokedark dark:bg-blacksection flex h-12.5 w-12.5 items-center justify-center rounded-[50%] border">
                <p className="text-metatitle3 font-medium text-black dark:text-white">
                  03
                </p>
              </div>
              <div className="md:w-3/5 lg:w-auto">
                <button className="text-xs font-medium text-black dark:text-white">
                  Enterprise Big Data & AI Insights Platform for Global HXGS
                  Leader
                </button>
              </div>
            </div>
          </motion.div>
          {/* <!-- Tab Menues End --> */}

          {/* <!-- Tab Content Start --> */}
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: -20,
              },

              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="animate_top max-w-c-1154 mx-auto"
          >
            {featuresTabData.map((feature, key) => (
              <div
                className={feature.id === currentTab ? "block" : "hidden"}
                key={key}
              >
                <FeaturesTabItem featureTab={feature} />
              </div>
            ))}
          </motion.div>
          {/* <!-- Tab Content End --> */}
        </div>
      </section>
      {/* <!-- ===== Features Tab End ===== --> */}
    </>
  );
};

export default FeaturesTab;
