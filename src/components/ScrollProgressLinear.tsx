"use client";

import { motion, useScroll, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-200 h-1.5 origin-left border-b-2 border-ink"
      style={{
        scaleX: scrollYProgress,
        background: "var(--accent)",
      }}
      aria-hidden
    />
  );
}
