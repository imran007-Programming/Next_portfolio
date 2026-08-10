"use client";

import { motion, useScroll, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] h-[2px] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "var(--accent)",
      }}
      aria-hidden
    />
  );
}
