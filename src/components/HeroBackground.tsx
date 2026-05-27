"use client";

import { motion, useReducedMotion } from "framer-motion";

export function HeroBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_50%,transparent_100%)]" />

      <motion.div
        className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.08, 1],
                opacity: [0.5, 0.75, 0.5],
              }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-1/3 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -30, 0], y: [0, 20, 0] }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-0 -left-16 h-48 w-48 rounded-full bg-teal-400/10 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 24, 0], y: [0, -16, 0] }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
