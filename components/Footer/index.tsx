"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-stroke dark:border-strokedark dark:bg-blacksection border-t bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="py-14 md:py-20">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-8">
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
                <p className="text-sectiontitle mb-1.5 text-xs font-semibold tracking-[3px] uppercase">
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

            <div className="flex w-full flex-col gap-10 md:flex-row lg:w-[60%]">
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
                <h4 className="text-itemtitle2 mb-4 font-medium text-black dark:text-white">
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
                        className="text-sm text-gray-700 transition hover:text-orange-400 dark:text-gray-300"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

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
                <h4 className="text-itemtitle2 mb-4 font-medium text-black dark:text-white">
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
                      className="border-stroke dark:border-strokedark w-full rounded-full border px-6 py-3 pr-12 text-sm shadow-sm focus:border-orange-400 focus:outline-none dark:bg-black dark:focus:border-orange-400"
                    />
                    <button
                      aria-label="Sign up"
                      className="absolute top-1/2 right-3 -translate-y-1/2"
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

        <div className="border-stroke dark:border-strokedark flex flex-col items-center justify-center gap-4 border-t py-6 text-center text-sm text-gray-600 md:flex-row md:justify-between md:text-left dark:text-gray-300">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <p>
              &copy; {new Date().getFullYear()} Aaronice. All rights reserved
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <ul className="flex items-center gap-5">
              <li>
                <a
                  href="https://www.facebook.com/share/1E5kdXD4gB/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <svg
                    className="fill-[#D1D8E0] transition-all duration-300 hover:fill-orange-400"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_48_1499)">
                      <path
                        d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"
                        fill=""
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_48_1499">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/aaronicepgcltd?igsh=eDlzcmhjb2M0NGdj&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <svg
                    className="fill-[#D1D8E0] transition-all duration-300 hover:fill-orange-400"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                      fill=""
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/aaronicepgcltd?s=21"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (formerly Twitter)"
                >
                  <svg
                    className="fill-[#D1D8E0] transition-all duration-300 hover:fill-orange-400"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      fill=""
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/aaronice-prime-global-company-ltd"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="fill-[#D1D8E0] transition-all duration-300 hover:fill-orange-400"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_48_1505)">
                      <path
                        d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"
                        fill=""
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_48_1505">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@edupath.solutions?_r=1&_t=ZS-94YXZSBLkET"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                >
                  <svg
                    className="fill-[#D1D8E0] transition-all duration-300 hover:fill-orange-400"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.9 2.9 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.95-.1z"
                      fill=""
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
