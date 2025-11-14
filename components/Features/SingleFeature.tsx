import React from "react";
import { Feature } from "@/types/feature";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, description } = feature;

  // Determine the link based on the title
  const getLink = () => {
    if (title === "Tech Skills Training & Bootcamps") {
      return "/#courses";
    }
    return "/contact";
  };

  return (
    <>
      <Link href={getLink()}>
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              y: -10,
            },

            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="animate_top dark:border-strokedark dark:bg-blacksection dark:hover:bg-hoverdark z-40 flex h-full cursor-pointer flex-col rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl xl:p-14"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-lg bg-orange-500 shadow-md">
            <Image src={icon} width={36} height={36} alt="title" />
          </div>
          <h3 className="xl:text-itemtitle mt-6 mb-4 text-xl font-bold text-black dark:text-white">
            {title}
          </h3>
          <p className="flex-1 leading-relaxed text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </motion.div>
      </Link>
    </>
  );
};

export default SingleFeature;
