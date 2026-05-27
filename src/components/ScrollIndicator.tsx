"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSectionNavigation } from "@/context/SectionNavigation";

export function ScrollIndicator() {
  const reduceMotion = useReducedMotion();
  const { navigateTo } = useSectionNavigation();

  return (
    <button
      type="button"
      onClick={() => navigateTo("about")}
      className="fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 text-zinc-500 transition-colors hover:text-accent"
      aria-label="Go to about section"
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.25em]">
        Next
      </span>
      <motion.span
        className="flex h-11 w-7 items-start justify-center rounded-full border border-white/20 pt-2"
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="h-2 w-1 rounded-full bg-accent" />
      </motion.span>
    </button>
  );
}
