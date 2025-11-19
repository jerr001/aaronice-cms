"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  const pathUrl = usePathname();

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
  });

  return (
    <header
      className={`fixed top-0 left-0 z-99999 w-full py-1.5 transition-all duration-300 md:py-2.5 lg:py-3.5 xl:py-5 ${
        stickyMenu
          ? "border-b border-orange-100 bg-orange-50/95 py-1 shadow-lg backdrop-blur-md md:py-1.5 lg:py-2 xl:py-3 dark:border-gray-800 dark:bg-gray-900/95"
          : "bg-orange-50/60 backdrop-blur-sm dark:bg-gray-900/60"
      }`}
    >
      <div className="max-w-c-1390 relative mx-auto items-center justify-between px-4 md:px-8 xl:flex 2xl:px-0">
        {/* Logo - Moved to the left */}
        <div className="flex items-center justify-start xl:w-1/4">
          <a href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/images/logo/banner-light.png"
              alt="logo"
              width={150}
              height={50}
              className="hidden h-8 w-auto md:h-10 lg:h-11 xl:h-auto xl:w-full dark:block"
            />
            <Image
              src="/images/logo/banner-light.png"
              alt="logo"
              width={150}
              height={50}
              className="h-8 w-auto md:h-10 lg:h-11 xl:h-auto xl:w-full dark:hidden"
            />
          </a>
        </div>

        {/* Nav Menu - Moved to the right */}
        <div
          className={`invisible h-0 w-full items-center justify-end xl:visible xl:flex xl:h-auto xl:w-auto ${
            navigationOpen &&
            "navbar dark:bg-blacksection visible! mt-4 h-auto max-h-[400px] rounded-xl border border-gray-100 bg-white p-7.5 shadow-xl xl:h-auto xl:border-0 xl:p-0 xl:shadow-none dark:border-gray-800 xl:dark:bg-transparent"
          }`}
        >
          <nav>
            <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-8">
              {menuData.map((menuItem, key) => (
                <li key={key} className={menuItem.submenu && "group relative"}>
                  {menuItem.submenu ? (
                    <>
                      <button
                        onClick={() => setDropdownToggler(!dropdownToggler)}
                        className="flex cursor-pointer items-center justify-between gap-3 font-medium text-gray-700 transition-colors hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400"
                      >
                        {menuItem.title}
                        <span>
                          <svg
                            className="h-3 w-3 cursor-pointer fill-current transition-colors"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                          </svg>
                        </span>
                      </button>

                      <ul
                        className={`dropdown ${dropdownToggler ? "flex" : ""}`}
                      >
                        {menuItem.submenu.map((item, key) => (
                          <li
                            key={key}
                            className="font-medium text-gray-700 transition-colors hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400"
                          >
                            <Link href={item.path || "#"}>{item.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={`${menuItem.path}`}
                      className={
                        pathUrl === menuItem.path
                          ? "font-semibold text-orange-500 dark:text-orange-400"
                          : "font-medium text-gray-700 transition-colors hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400"
                      }
                    >
                      {menuItem.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggler */}
          <ThemeToggler />

          {/* Hamburger Toggle BTN */}
          <button
            aria-label="hamburger Toggler"
            className="block xl:hidden"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="absolute right-0 block h-full w-full">
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 rounded-sm bg-gray-800 delay-0 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "w-full! delay-300" : "w-0"
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 rounded-sm bg-gray-800 delay-150 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "w-full! delay-400" : "w-0"
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 rounded-sm bg-gray-800 delay-200 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "w-full! delay-500" : "w-0"
                  }`}
                ></span>
              </span>
              <span className="du-block absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute top-0 left-2.5 block h-full w-0.5 rounded-sm bg-gray-800 delay-300 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "h-0! delay-0" : "h-full"
                  }`}
                ></span>
                <span
                  className={`absolute top-2.5 left-0 block h-0.5 w-full rounded-sm bg-gray-800 delay-400 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "h-0! delay-200" : "h-0.5"
                  }`}
                ></span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
