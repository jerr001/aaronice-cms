"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer className="border-t border-stroke bg-white dark:border-strokedark dark:bg-blacksection">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          {/* <!-- Footer Top --> */}
          <div className="py-20 lg:py-25">


             <div className="flex flex-col lg:flex-row lg:gap-8 gap-12">
  {/* Left: 40% width */}
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
    <a href="/" className="relative inline-block">
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
    <p className="mt-5 mb-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
       Aaronice Prime Global Company Ltd was established with a clear vision to provide intelligent technology solutions to real-world challenges and cultivate the next generation of tech professionals. Backed by a team of seasoned experts with decades of industry experience, we have successfully delivered innovative digital products across key sectors including education, healthcare, agriculture, and retail. Through our dedicated training division, Aaronice Academy, we bridge the gap between knowledge and application by equipping individuals with practical, in-demand tech skills tailored to today’s dynamic digital landscape.
    </p>
    <p className="mb-1.5 text-xs font-semibold uppercase tracking-[3px] text-sectiontitle">
      Contact
    </p>
    <a
      href="mailto:support@aaronice.com"
      className="text-itemtitle font-medium text-black dark:text-white"
    >
      support@aaronice.com
    </a>
  </motion.div>

  {/* Right: 60% width */}
  <div className="w-full lg:w-[60%] flex flex-col md:flex-row gap-12">
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
      <h4 className="mb-6 text-itemtitle2 font-medium text-black dark:text-white">
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
              className="text-gray-700 dark:text-gray-300 hover:text-orange-400 transition"
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
      <h4 className="mb-6 text-itemtitle2 font-medium text-black dark:text-white">
        Newsletter
      </h4>
      <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
        Subscribe to receive future updates.
      </p>
      <form action="#" className="w-full max-w-sm">
        <div className="relative">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-full border border-stroke px-6 py-3 pr-12 shadow-sm focus:border-orange-400 focus:outline-none dark:border-strokedark dark:bg-black dark:focus:border-orange-400"
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
          {/* <!-- Footer Top --> */}

          {/* <!-- Footer Bottom --> */}
          <div className="flex flex-col flex-wrap items-center justify-center gap-5 border-t border-stroke py-7 dark:border-strokedark lg:flex-row lg:justify-between lg:gap-0">
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
              <ul className="flex items-center gap-8">
                <li>
                  <a href="#" className="hover:text-orange-400">
                    English
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400">
                    Support
                  </a>
                </li>
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
              <p>
                &copy; {new Date().getFullYear()}  Aaronice Prime. All rights reserved
              </p>
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
              <ul className="flex items-center gap-5">
                <li>
                  <a href="https://www.facebook.com/share/19XsgZEhe7/" aria-label="social icon">
                    <svg
                      className="fill-[#D1D8E0] transition-all duration-300 hover:fill-orange-400"
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
    className="fill-[#D1D8E0] transition-all duration-300 hover:fill-orange-400"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16.472 2H19.8l-7.296 8.344L21 22h-6.884l-5.39-6.881L3.6 22H.268l7.88-9.008L3 2h6.993l4.885 6.244L16.472 2Zm-1.032 18h1.9L7.608 4h-1.9l8.732 16Z" />
  </svg>


                  </a>
                </li>
                <li>
                  <a href="#" aria-label="social icon">
                    <svg
                      className="fill-[#D1D8E0] transition-all duration-300 hover:fill-orange-400"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_48_1505)">
                        <path
                          d="M6.94 5.00002C6.93974 5.53046 6.72877 6.03906 6.35351 6.41394C5.97825 6.78883 5.46944 6.99929 4.939 6.99902C4.40857 6.99876 3.89997 6.78779 3.52508 6.41253C3.1502 6.03727 2.93974 5.52846 2.94 4.99802C2.94027 4.46759 3.15124 3.95899 3.5265 3.5841C3.90176 3.20922 4.41057 2.99876 4.941 2.99902C5.47144 2.99929 5.98004 3.21026 6.35492 3.58552C6.72981 3.96078 6.94027 4.46959 6.94 5.00002ZM7 8.48002H3V21H7V8.48002ZM13.32 8.48002H9.34V21H13.28V14.43C13.28 10.77 18.05 10.43 18.05 14.43V21H22V13.07C22 6.90002 14.94 7.13002 13.28 10.16L13.32 8.48002Z"
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
                  <a href="https://www.instagram.com/aaronicepgcltd?igsh=eDlzcmhjb2M0NGdj" aria-label="social icon">
  <svg
    className="fill-[#D1D8E0] transition-all duration-300 hover:fill-orange-400"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5Zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5ZM17.5 6a1 1 0 1 1 0 2a1 1 0 0 1 0-2Z"/>
  </svg>
</a>


                  </li>

                {/* <li>
                  <a href="#" aria-label="social icon">
                    <svg
                      className="fill-[#D1D8E0] transition-all duration-300 hover:fill-orange-400"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_48_1508)">
                        <path d="M7.443 5.3501C8.082 5.3501 8.673 5.4001 9.213 5.5481C9.70301 5.63814 10.1708 5.82293 10.59 6.0921C10.984 6.3391 11.279 6.6861 11.475 7.1311C11.672 7.5761 11.77 8.1211 11.77 8.7141C11.77 9.4071 11.623 10.0001 11.279 10.4451C10.984 10.8911 10.492 11.2861 9.902 11.5831C10.738 11.8311 11.377 12.2761 11.77 12.8691C12.164 13.4631 12.41 14.2051 12.41 15.0461C12.41 15.7391 12.262 16.3321 12.016 16.8271C11.77 17.3221 11.377 17.7671 10.934 18.0641C10.4528 18.3825 9.92084 18.6165 9.361 18.7561C8.771 18.9051 8.181 19.0041 7.591 19.0041H1V5.3501H7.443ZM7.049 10.8901C7.59 10.8901 8.033 10.7421 8.377 10.4951C8.721 10.2481 8.869 9.8021 8.869 9.2581C8.869 8.9611 8.819 8.6641 8.721 8.4671C8.623 8.2691 8.475 8.1201 8.279 7.9721C8.082 7.8731 7.885 7.7741 7.639 7.7251C7.393 7.6751 7.148 7.6751 6.852 7.6751H4V10.8911H7.05L7.049 10.8901ZM7.197 16.7281C7.492 16.7281 7.787 16.6781 8.033 16.6291C8.28138 16.5819 8.51628 16.4805 8.721 16.3321C8.92139 16.1873 9.08903 16.002 9.213 15.7881C9.311 15.5411 9.41 15.2441 9.41 14.8981C9.41 14.2051 9.213 13.7101 8.82 13.3641C8.426 13.0671 7.885 12.9191 7.246 12.9191H4V16.7291H7.197V16.7281ZM16.689 16.6781C17.082 17.0741 17.672 17.2721 18.459 17.2721C19 17.2721 19.492 17.1241 19.885 16.8771C20.279 16.5801 20.525 16.2831 20.623 15.9861H23.033C22.639 17.1731 22.049 18.0141 21.263 18.5581C20.475 19.0531 19.541 19.3501 18.41 19.3501C17.6864 19.3523 16.9688 19.2179 16.295 18.9541C15.6887 18.7266 15.148 18.3529 14.721 17.8661C14.2643 17.4107 13.9267 16.8498 13.738 16.2331C13.492 15.5901 13.393 14.8981 13.393 14.1061C13.393 13.3641 13.492 12.6721 13.738 12.0281C13.9745 11.4082 14.3245 10.8378 14.77 10.3461C15.213 9.9011 15.754 9.5061 16.344 9.2581C17.0007 8.99416 17.7022 8.85969 18.41 8.8621C19.246 8.8621 19.984 9.0111 20.623 9.3571C21.263 9.7031 21.754 10.0991 22.148 10.6931C22.5499 11.2636 22.8494 11.8998 23.033 12.5731C23.131 13.2651 23.18 13.9581 23.131 14.7491H16C16 15.5411 16.295 16.2831 16.689 16.6791V16.6781ZM19.787 11.4841C19.443 11.1381 18.902 10.9401 18.262 10.9401C17.82 10.9401 17.475 11.0391 17.18 11.1871C16.885 11.3361 16.689 11.5341 16.492 11.7321C16.311 11.9234 16.1912 12.1643 16.148 12.4241C16.098 12.6721 16.049 12.8691 16.049 13.0671H20.475C20.377 12.3251 20.131 11.8311 19.787 11.4841V11.4841ZM15.459 6.2901H20.967V7.6261H15.46V6.2901H15.459Z" />
                      </g>
                      <defs>
                        <clipPath id="clip0_48_1508">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </li> */}
              </ul>
            </motion.div>
          </div>
          {/* <!-- Footer Bottom --> */}
        </div>
      </footer>
    </>
  );
};

export default Footer;
