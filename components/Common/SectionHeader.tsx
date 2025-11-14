"use client";
import { motion } from "framer-motion";

type HeaderInfo = {
  title: string;
  subtitle: string;
  description: string;
};

const SectionHeader = ({ headerInfo }: { headerInfo: HeaderInfo }) => {
  const { title, subtitle, description } = headerInfo;

  return (
    <>
      {/* <!-- Section Title Start --> */}
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
        transition={{ duration: 1, delay: 0.1 }}
        viewport={{ once: true }}
        className="animate_top mx-auto px-6 text-center sm:px-8 md:px-12 xl:px-16 2xl:px-20"
      >
        <div className="mb-5 inline-block rounded-full border border-orange-200 bg-orange-50 px-6 py-2 dark:border-orange-900 dark:bg-orange-950">
          <span className="text-sm font-semibold tracking-wide text-orange-600 uppercase dark:text-orange-400">
            {title}
          </span>
        </div>
        <h2 className="xl:text-sectiontitle3 mx-auto mb-5 text-3xl font-bold text-black md:w-4/5 xl:w-1/2 dark:text-white">
          {subtitle}
        </h2>
        <p className="mx-auto text-lg leading-relaxed text-gray-600 md:w-4/5 lg:w-3/5 xl:w-[46%] dark:text-gray-300">
          {description}
        </p>
      </motion.div>
      {/* <!-- Section Title End --> */}
    </>
  );
};

export default SectionHeader;
