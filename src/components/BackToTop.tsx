"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-24 right-4 z-[80] sm:right-6"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <motion.button
            type="button"
            aria-label="Back to top"
            onClick={scrollToTop}
            className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#0e0e0e]/90 text-white backdrop-blur-xl transition-all duration-300 hover:border-accent/40 hover:text-accent"
            style={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
            whileHover={reduceMotion ? undefined : { scale: 1.12, y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-1"
            >
              <path
                d="M12 19V5M5 12l7-7 7 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
