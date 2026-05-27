"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSectionNavigation } from "@/context/SectionNavigation";
import { sectionIndex, SECTION_IDS } from "@/lib/sections";

export function ScrollProgress() {
  const { section } = useSectionNavigation();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  const progress = (sectionIndex(section) + 1) / SECTION_IDS.length;

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-[60] h-0.5 origin-left bg-accent"
      animate={{ scaleX: progress }}
      initial={false}
      transition={{ type: "spring", stiffness: 120, damping: 30 }}
      aria-hidden
    />
  );
}
