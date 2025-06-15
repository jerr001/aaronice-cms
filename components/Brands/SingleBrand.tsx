import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Brand } from "@/types/brand";
import { motion } from "framer-motion";

const SingleBrand = ({ brand }: { brand: Brand }) => {
  const { image, href, name, imageLight, id } = brand;

  return (
    <>
      <motion.a
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
        transition={{ duration: 1, delay: id }}
        viewport={{ once: true }}
        href={href}
        className="animate_top mx-w-full relative block h-10 w-[140px]"
      >
        {/* <Image
          className="opacity-65 transition-all duration-300 hover:opacity-100 dark:hidden"
          src={image}
          alt={name}
          fill
        /> */}
        <div  className="opacity-65 transition-all duration-300 hover:opacity-100 dark:hidden font-extrabold text-xl text-orange-400" >
          {image}
        </div>
        <div  className="hidden opacity-70 transition-all duration-300 hover:opacity-100 dark:block font-extrabold text-xl text-white" >
          {image}
        </div>
        {/* <Image
          className="hidden opacity-50 transition-all duration-300 hover:opacity-100 dark:block"
          src={imageLight}
          alt={name}
          fill
        /> */}
      </motion.a>
    </>
  );
};

export default SingleBrand;
