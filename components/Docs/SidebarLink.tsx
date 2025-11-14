"use client";
import Link from "next/link";

const SidebarLink = () => {
  return (
    <>
      <li className="block">
        <Link
          href={`/about`}
          className={`dark:bg-blackho flex w-full rounded-xs px-3 py-2 text-base text-black dark:text-white`}
        >
          Introduction
        </Link>
        <Link
          href={`/about#vision`}
          className={`flex w-full rounded-xs px-3 py-2 text-base text-black dark:text-white`}
        >
          Our Vision
        </Link>
        <Link
          href={`/about#mission`}
          className={`flex w-full rounded-xs px-3 py-2 text-base text-black dark:text-white`}
        >
          Our Mission
        </Link>
      </li>
    </>
  );
};

export default SidebarLink;
