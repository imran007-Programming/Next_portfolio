"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { skillCategories, skills } from "@/data/skills";

const TECH_COLORS: Record<string, string> = {
  "Next.js": "#ffffff", "React": "#61DAFB", "TypeScript": "#3178C6",
  "JavaScript": "#F7DF1E", "Tailwind CSS": "#38BDF8", "Sass": "#CC6699",
  "Framer Motion": "#BB4BFF", "Redux": "#764ABC", "Vite": "#646CFF",
  "HTML & CSS": "#E34F26", "Node.js": "#339933", "Express": "#ffffff",
  "NestJS": "#E0234E", "REST APIs": "#2dd4bf", "GraphQL": "#E10098",
  "PostgreSQL": "#4169E1", "MongoDB": "#47A248", "Prisma": "#5A67D8",
  "Redis": "#DC382D", "Git": "#F05032", "GitHub": "#ffffff",
  "Docker": "#2496ED", "Postman": "#FF6C37", "Vercel": "#ffffff",
  "Figma": "#F24E1E", "VS Code": "#007ACC", "Linux": "#FCC624",
  "CI/CD": "#2dd4bf",
};

export function ServicesAccordion() {
  const [openId, setOpenId] = useState<string | null>("frontend");
  const reduceMotion = useReducedMotion();

  const descriptions: Record<string, string> = {
    frontend: "Building fast, responsive, and beautiful user interfaces with modern React ecosystem tools.",
    backend: "Scalable server-side applications, REST APIs, and databases that handle real-world traffic.",
    tools: "Professional workflow tools for version control, deployment, and team collaboration.",
  };

  return (
    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
      {skillCategories.map((cat, idx) => {
        const catSkills = skills.filter((s) => s.category === cat.id);
        const isOpen = openId === cat.id;

        return (
          <div key={cat.id}>
            {/* Header row */}
            <button
              className="group flex w-full items-center justify-between py-6 text-left transition-colors duration-200"
              onClick={() => setOpenId(isOpen ? null : cat.id)}
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-6">
                <span
                  className="text-sm font-mono tabular-nums"
                  style={{ color: "var(--muted)" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3
                    className="text-xl font-bold tracking-tight transition-colors duration-200"
                    style={{ color: isOpen ? "var(--accent)" : "var(--foreground)" }}
                  >
                    {cat.title}
                  </h3>
                  <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className="hidden text-xs font-medium sm:block"
                  style={{ color: "var(--muted)" }}
                >
                  {catSkills.length} technologies
                </span>
                {/* Plus / Minus icon */}
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition-all duration-300"
                  style={{
                    borderColor: isOpen ? "var(--accent)" : "var(--border)",
                    background: isOpen ? "var(--accent)" : "transparent",
                    color: isOpen ? "#080808" : "var(--muted)",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Accordion content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="pb-8">
                    <p
                      className="mb-5 max-w-xl text-sm leading-relaxed"
                      style={{ color: "var(--muted)" }}
                    >
                      {descriptions[cat.id]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((skill) => {
                        const c = TECH_COLORS[skill.name] ?? cat.accent;
                        return (
                          <span
                            key={skill.id}
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105"
                            style={{
                              background: `${c}15`,
                              border: `1px solid ${c}35`,
                              color: c,
                            }}
                          >
                            {skill.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
