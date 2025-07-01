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
              className="animate_top"
            >

                <p>&copy; {new Date().getFullYear()} Aaronice Prime. All rights reserved</p>
          <ul className="flex flex-wrap justify-center gap-4 md:justify-start">
            <li><a href="#" className="hover:text-orange-400">English</a></li>
            <li><a href="#" className="hover:text-orange-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-orange-400">Support</a></li>
          </ul>


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
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top"
            >

              <ul className="flex gap-4">
                <li>
                  <a href="https://www.facebook.com/share/19XsgZEhe7/" aria-label="social icon">
                    <svg
                      className="fill-[#D1D8E0] transition-all duration-300 hover:text-orange-400"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_48_1499)">
                        <path
                          d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z"
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
                  <a href="https://x.com/AaronicePGCLtd?t=SW1E_-V9NvTyDCqG8fUNnQ&s=09" aria-label="social icon">
                    <svg
                      className="fill-[#D1D8E0] transition-all duration-300 hover:text-orange-400"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_48_1502)">
                        <path
                          d="M22.162 5.65593C21.3985 5.99362 20.589 6.2154 19.76 6.31393C20.6337 5.79136 21.2877 4.96894 21.6 3.99993C20.78 4.48793 19.881 4.82993 18.944 5.01493C18.3146 4.34151 17.4803 3.89489 16.5709 3.74451C15.6615 3.59413 14.7279 3.74842 13.9153 4.18338C13.1026 4.61834 12.4564 5.30961 12.0771 6.14972C11.6978 6.98983 11.6067 7.93171 11.818 8.82893C10.1551 8.74558 8.52832 8.31345 7.04328 7.56059C5.55823 6.80773 4.24812 5.75098 3.19799 4.45893C2.82628 5.09738 2.63095 5.82315 2.63199 6.56193C2.63199 8.01193 3.36999 9.29293 4.49199 10.0429C3.828 10.022 3.17862 9.84271 2.59799 9.51993V9.57193C2.59819 10.5376 2.93236 11.4735 3.54384 12.221C4.15532 12.9684 5.00647 13.4814 5.95299 13.6729C5.33661 13.84 4.6903 13.8646 4.06299 13.7449C4.32986 14.5762 4.85 15.3031 5.55058 15.824C6.25117 16.345 7.09712 16.6337 7.96999 16.6499C7.10247 17.3313 6.10917 17.8349 5.04687 18.1321C3.98458 18.4293 2.87412 18.5142 1.77899 18.3819C3.69069 19.6114 5.91609 20.2641 8.18899 20.2619C15.882 20.2619 20.089 13.8889 20.089 8.36193C20.089 8.18193 20.084 7.99993 20.076 7.82193C20.8949 7.2301 21.6016 6.49695 22.163 5.65693L22.162 5.65593Z"
                          fill=""
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_48_1502">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </li>
                <li>
                   <a href="https://www.instagram.com/aaronicepgcltd?igsh=eDlzcmhjb2M0NGdj" aria-label="LinkedIn" className="group">
        

            <svg
    width="24" height="24"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M349.33 69.33a93.62 93.62 0 0 1 93.34 93.34v186.66a93.62 93.62 0 0 1-93.34 93.34H162.67a93.62 93.62 0 0 1-93.34-93.34V162.67a93.62 93.62 0 0 1 93.34-93.34h186.66m0-37.33H162.67C90.8 32 32 90.8 32 162.67v186.66C32 421.2 90.8 480 162.67 480h186.66C421.2 480 480 421.2 480 349.33V162.67C480 90.8 421.2 32 349.33 32z"/>
    <circle cx="377.33" cy="162.67" r="28"/>
    <circle cx="256" cy="256" r="74.67"/>
  </svg>

  {/* <svg className="fill-[#D1D8E0] transition-all duration-300 group-hover:fill-orange-400"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_48_1508)">
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill=""
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg> */}
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
