"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Footer = () => {
  return (
 <footer className="border-t border-stroke bg-white dark:border-strokedark dark:bg-blacksection">
  <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Footer Top */}
        <div className="py-14 md:py-20">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-8">
            {/* Left Column */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="w-full lg:w-[40%]"
            >
              <a href="/" className="inline-block">
                <Image
                  width={110}
                  height={80}
                  src="/images/logo/banner-light.png"
                  alt="Logo"
                  className="dark:hidden"
                />
                <Image
                  width={110}
                  height={80}
                  src="/images/logo/banner-light.png"
                  alt="Logo"
                  className="hidden dark:block"
                />
              </a>
              <p className="mt-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                Aaronice Prime Global Company Ltd was established with a clear
                vision to provide intelligent technology solutions to real-world
                challenges and cultivate the next generation of tech
                professionals.
              </p>
              <div className="mt-6">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-[3px] text-sectiontitle">
                  Contact
                </p>
                <a
                  href="mailto:support@aaronice.com"
                  className="text-itemtitle font-medium text-black dark:text-white"
                >
                  support@aaronice.com
                </a>
              </div>
            </motion.div>

            {/* Right Columns */}
            <div className="w-full lg:w-[60%] flex flex-col gap-10 md:flex-row">
              {/* Quick Links */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
                className="w-full md:w-1/2"
              >
                <h4 className="mb-4 text-itemtitle2 font-medium text-black dark:text-white">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  {[
                    { name: "Home", href: "/" },
                    { name: "About", href: "/about" },
                    { name: "Service", href: "/#services" },
                    { name: "Course", href: "/#courses" },
                    { name: "Contact", href: "/contact" },
                  ].map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm text-gray-700 dark:text-gray-300 hover:text-orange-400 transition"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Newsletter */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
                className="w-full md:w-1/2"
              >
                <h4 className="mb-4 text-itemtitle2 font-medium text-black dark:text-white">
                  Newsletter
                </h4>
                <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                  Subscribe to receive future updates.
                </p>
                <form className="w-full max-w-sm">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full rounded-full border border-stroke px-6 py-3 pr-12 text-sm shadow-sm focus:border-orange-400 focus:outline-none dark:border-strokedark dark:bg-black dark:focus:border-orange-400"
                    />
                    <button
                      aria-label="Sign up"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <svg
                        className="fill-[#757693] hover:fill-orange-400 dark:fill-white"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M3.12 1.17L18.5 9.63c.06.04.11.09.15.15s.06.13.06.22-.02.15-.06.21-.09.11-.15.15L3.12 18.83a.505.505 0 0 1-.61-.06.498.498 0 0 1-.01-.68V1.54a.498.498 0 0 1 .62-.37ZM4.17 10.83v5.52L15.71 10 4.17 3.65v5.51h4.17v1.67H4.17Z" />
                      </svg>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col items-center justify-center gap-4 border-t border-stroke py-6 text-center text-sm text-gray-600 dark:border-strokedark dark:text-gray-300 md:flex-row md:justify-between md:text-left">
          <p>&copy; {new Date().getFullYear()} Aaronice Prime. All rights reserved</p>
          <ul className="flex flex-wrap justify-center gap-4 md:justify-start">
            <li><a href="#" className="hover:text-orange-400">English</a></li>
            <li><a href="#" className="hover:text-orange-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-orange-400">Support</a></li>
          </ul>
          <ul className="flex gap-4">
            {/* Social icons (your code already includes icons with hover effects) */}
            {/* ... */}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
