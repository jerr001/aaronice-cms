"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed right-8 bottom-8 z-99">
      {isVisible && (
        <div
          onClick={scrollToTop}
          aria-label="scroll to top"
          className="hover:shadow-signUp flex h-10 w-10 cursor-pointer items-center justify-center rounded-xs bg-orange-400 text-white shadow-md transition duration-300 ease-in-out hover:bg-orange-400/80"
        >
          <span className="mt-[6px] h-3 w-3 rotate-45 border-t border-l border-white"></span>
          <span className="sr-only">scroll to top</span>
        </div>
      )}
    </div>
  );
}
