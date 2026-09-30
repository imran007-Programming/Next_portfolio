"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { skillCategories, skills } from "@/data/skills";
import {
  SiNextdotjs, SiReact, SiTypescript, SiJavascript, SiTailwindcss,
  SiSass, SiFramer, SiRedux, SiVite, SiHtml5,
  SiNodedotjs, SiExpress, SiNestjs, SiGraphql,
  SiPostgresql, SiMongodb, SiPrisma, SiRedis,
  SiGit, SiGithub, SiDocker, SiPostman, SiVercel,
  SiFigma, SiLinux
} from "react-icons/si";
import { BiServer } from "react-icons/bi";
import { FaCode } from "react-icons/fa";

const TECH_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  "Next.js": SiNextdotjs,
  "React": SiReact,
  "TypeScript": SiTypescript,
  "JavaScript": SiJavascript,
  "Tailwind CSS": SiTailwindcss,
  "Sass": SiSass,
  "Framer Motion": SiFramer,
  "Redux": SiRedux,
  "Vite": SiVite,
  "HTML & CSS": SiHtml5,
  "Node.js": SiNodedotjs,
  "Express": SiExpress,
  "NestJS": SiNestjs,
  "REST APIs": BiServer,
  "GraphQL": SiGraphql,
  "PostgreSQL": SiPostgresql,
  "MongoDB": SiMongodb,
  "Prisma": SiPrisma,
  "Redis": SiRedis,
  "Git": SiGit,
  "GitHub": SiGithub,
  "Docker": SiDocker,
  "Postman": SiPostman,
  "Vercel": SiVercel,
  "Figma": SiFigma,
  "VS Code": FaCode,
  "Linux": SiLinux,
  "CI/CD": FaCode,
};

// Brand colours for the icons (tuned to read on a white chip)
const TECH_COLORS: Record<string, string> = {
  "Next.js": "#0a0a0a", "React": "#149eca", "TypeScript": "#3178C6",
  "JavaScript": "#d4b000", "Tailwind CSS": "#0ea5e9", "Sass": "#CC6699",
  "Framer Motion": "#BB4BFF", "Redux": "#764ABC", "Vite": "#646CFF",
  "HTML & CSS": "#E34F26", "Node.js": "#339933", "Express": "#0a0a0a",
  "NestJS": "#E0234E", "REST APIs": "#0d9488", "GraphQL": "#E10098",
  "PostgreSQL": "#4169E1", "MongoDB": "#47A248", "Prisma": "#2D3748",
  "Redis": "#DC382D", "Git": "#F05032", "GitHub": "#0a0a0a",
  "Docker": "#2496ED", "Postman": "#FF6C37", "Vercel": "#0a0a0a",
  "Figma": "#F24E1E", "VS Code": "#007ACC", "Linux": "#0a0a0a",
  "CI/CD": "#0d9488",
};

const CATEGORY_COLORS = ["var(--nb-pink)", "var(--nb-blue)", "var(--nb-green)", "var(--nb-orange)"];

export function ServicesAccordion() {
  const [openId, setOpenId] = useState<string | null>("frontend");
  const reduceMotion = useReducedMotion();

  const descriptions: Record<string, string> = {
    frontend: "Building fast, responsive, and beautiful user interfaces with modern React ecosystem tools.",
    backend: "Scalable server-side applications, REST APIs, and databases that handle real-world traffic.",
    tools: "Professional workflow tools for version control, deployment, and team collaboration.",
  };

  return (
    <div className="flex flex-col gap-5">
      {skillCategories.map((cat, idx) => {
        const catSkills = skills.filter((s) => s.category === cat.id);
        const isOpen = openId === cat.id;

        return (
          <div key={cat.id} className="nb-card overflow-hidden">
            {/* Header row */}
            <button
              className={`group flex w-full items-center justify-between px-5 py-5 text-left transition-colors duration-150 sm:px-6 ${
                isOpen ? "border-b-[3px] border-ink bg-accent" : "hover:bg-surface-2"
              }`}
              onClick={() => setOpenId(isOpen ? null : cat.id)}
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <span
                  className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-[3px] border-ink text-base shadow-[3px_3px_0_0_#0a0a0a]"
                  style={{ background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg uppercase sm:text-xl">
                    {cat.title}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-muted">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="nb-tag hidden bg-surface px-2.5 py-1 text-xs sm:inline-flex">
                  {catSkills.length} tech
                </span>
                {/* Plus / Minus icon */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-[3px] border-ink transition-colors duration-150 ${
                    isOpen ? "bg-ink text-white" : "bg-surface"
                  }`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
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
                  <div className="px-5 pb-7 pt-5 sm:px-6">
                    <p className="mb-5 max-w-xl text-sm font-medium leading-relaxed text-muted">
                      {descriptions[cat.id]}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {catSkills.map((skill) => {
                        const c = TECH_COLORS[skill.name] ?? "#0a0a0a";
                        const Icon = TECH_ICONS[skill.name];
                        return (
                          <span
                            key={skill.id}
                            className="flex cursor-default items-center gap-2 rounded-lg border-2 border-ink bg-surface px-3 py-2 text-xs font-bold shadow-[2px_2px_0_0_#0a0a0a] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-accent hover:shadow-[4px_4px_0_0_#0a0a0a]"
                          >
                            {Icon && <Icon className="shrink-0 text-base" style={{ color: c }} />}
                            <span>{skill.name}</span>
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
