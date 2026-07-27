"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const roles = [
  "Full Stack Developer",
  "React & Next.js Builder",
  "API & Database Engineer",
];

export function RotatingRole() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % roles.length);
    }, 3200);
    return () => clearInterval(id);
  }, [reduceMotion]);

  if (reduceMotion) {
    return <span className="text-muted">— {roles[0]}</span>;
  }

  return (
    <span className="relative inline-block min-h-[1.2em] text-muted">
      <span className="invisible" aria-hidden>
        — {roles.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          className="absolute left-0 top-0 whitespace-nowrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          — {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
