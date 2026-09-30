"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ServicesAccordion } from "@/components/ServicesAccordion";
import { SectionHeading } from "@/components/SectionHeading";

export function Skills() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="skills" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* Header */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Tech Stack" title="Tools & {Technologies}" />
          <p className="max-w-sm text-sm font-medium leading-relaxed text-muted">
            Organized by what I use to build interfaces, backends, and ship reliably.
          </p>
        </div>

        {/* Accordion */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 }}
        >
          <ServicesAccordion />
        </motion.div>

      </div>
    </section>
  );
}
