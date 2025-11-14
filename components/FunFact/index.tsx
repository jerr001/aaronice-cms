"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const FunFact = () => {
  return (
    <>
      <section className="px-4 py-20 md:px-8 lg:py-22.5 2xl:px-0">
        <div className="max-w-c-1390 dark:bg-blacksection dark:stroke-strokedark relative z-1 mx-auto rounded-lg bg-linear-to-t from-[#F8F9FF] to-[#efcab2] py-22.5 xl:py-27.5 dark:bg-linear-to-t dark:from-transparent dark:to-transparent">
          <Image
            width={132}
            height={132}
            src="/images/shape/shape-05.png"
            alt="Doodle"
            className="absolute right-0 bottom-0 -z-1"
          />

          <Image
            fill
            src="/images/shape/shape-dotted-light-02.svg"
            alt="Dotted"
            className="absolute top-0 left-0 -z-1 dark:hidden"
          />
          <Image
            fill
            src="/images/shape/shape-dotted-dark-02.svg"
            alt="Dotted"
            className="absolute top-0 left-0 -z-1 hidden dark:block"
          />

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
            className="animate_top mx-auto mb-12.5 px-4 text-center md:w-4/5 md:px-0 lg:mb-17.5 lg:w-2/3 xl:w-1/2"
          >
            <h2 className="xl:text-sectiontitle3 mb-4 text-3xl font-bold text-black dark:text-white">
              Trusted by Global Clients.
            </h2>
            <p className="mx-auto lg:w-11/12">
              We build lasting partnerships by delivering dependable,
              well-crafted IT solutions that meet real business challenges.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 lg:gap-42.5">
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
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
              className="animate_top text-center"
            >
              <h3 className="xl:text-sectiontitle3 mb-2.5 text-3xl font-bold text-black dark:text-white">
                300+
              </h3>
              <p className="lg:text-para2 text-lg">Clients</p>
            </motion.div>
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
              transition={{ duration: 1, delay: 0.7 }}
              viewport={{ once: true }}
              className="animate_top text-center"
            >
              <h3 className="xl:text-sectiontitle3 mb-2.5 text-3xl font-bold text-black dark:text-white">
                500+
              </h3>
              <p className="lg:text-para2 text-lg">Students </p>
            </motion.div>
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
              transition={{ duration: 1, delay: 0.8 }}
              viewport={{ once: true }}
              className="animate_top text-center"
            >
              <h3 className="xl:text-sectiontitle3 mb-2.5 text-3xl font-bold text-black dark:text-white">
                300+
              </h3>
              <p className="lg:text-para2 text-lg">Projects</p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FunFact;
