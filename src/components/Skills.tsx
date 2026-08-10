"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ServicesAccordion } from "@/components/ServicesAccordion";
import { SectionHeading } from "@/components/SectionHeading";
import { FramerBlurWordReveal } from "@/components/TextReveal";

export function Skills() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="skills"
      className="border-t py-24 md:py-32"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* Header */}
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Tech Stack" title="Tools & {Technologies}" />
          <div className="max-w-sm text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <FramerBlurWordReveal text="Organized by what I use to build interfaces, backends, and ship reliably." delay={0.25} />
          </div>
        </div>

        {/* Accordion */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <ServicesAccordion />
        </motion.div>

      </div>
    </section>
  );
}
