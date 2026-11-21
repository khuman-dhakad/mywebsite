"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (top > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <aside
      aria-label="Back to top navigation"
      className={`fixed z-30 transition-all duration-500 ease-out bottom-20 md:bottom-24 right-4 md:right-6 ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top of page"
        className="flex items-center justify-center w-11 h-11 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-heritage-700 dark:text-heritage-400 border border-heritage-200 dark:border-heritage-800 shadow-lg hover:shadow-xl hover:bg-heritage-700 hover:text-white dark:hover:bg-heritage-600 dark:hover:text-stone-950 hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-heritage-600"
      >
        <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
      </button>
    </aside>
  );
}
