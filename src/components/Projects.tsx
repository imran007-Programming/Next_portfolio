"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { SectionHeading } from "@/components/SectionHeading";
import { FramerBlurWordReveal } from "@/components/TextReveal";

const TECH_COLORS: Record<string, string> = {
  "React": "#38bdf8", "Next.js": "#a3a3a3", "TypeScript": "#60a5fa",
  "JavaScript": "#fbbf24", "Tailwind CSS": "#2dd4bf", "Vite": "var(--accent)",
  "Framer Motion": "#f472b6", "Vercel": "#94a3b8", "CSS": "#818cf8",
  "Audio API": "#34d399", "Node.js": "#86efac", "Express": "#c9d1d9",
  "Prisma": "#a5b4fc", "PostgreSQL": "#93c5fd", "MongoDB": "#6ee7b7",
  "Mongoose": "#fca5a5",
};
const FALLBACK = ["#fb923c", "#e879f9", "#4ade80", "#f87171", "#facc15"];
function techColor(name: string, idx: number) {
  return TECH_COLORS[name] ?? FALLBACK[idx % FALLBACK.length];
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const imgRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isEven = index % 2 === 0;

  return (
    <motion.article
      className="group grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Image side */}
      <div
        ref={imgRef}
        className={`relative overflow-hidden bg-[#0d0d0d] ${isEven ? "md:order-1" : "md:order-2"}`}
        style={{ minHeight: "320px" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: isEven
              ? "linear-gradient(to right, transparent 60%, var(--surface))"
              : "linear-gradient(to left, transparent 60%, var(--surface))",
          }}
        />
        {/* Index badge */}
        <div className="absolute top-4 left-4">
          <span
            className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-md"
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid var(--border)",
              color: "var(--accent)",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        {index === 0 && (
          <div className="absolute top-4 right-4">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg backdrop-blur-md"
              style={{
                background: "var(--accent-dim)",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
              }}
            >
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content side */}
      <div
        className={`flex flex-col justify-center p-8 md:p-10 ${isEven ? "md:order-2" : "md:order-1"}`}
      >
        {/* Title */}
        <h3
          className="text-2xl font-bold tracking-tight transition-colors duration-200 group-hover:text-accent md:text-3xl"
          style={{ color: "var(--foreground)" }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          className="mt-3 text-sm leading-relaxed line-clamp-3"
          style={{ color: "var(--muted)" }}
        >
          {project.description}
        </p>

        {/* Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="flex flex-col">
                <span
                  className="text-lg font-bold leading-none"
                  style={{ color: "var(--accent)" }}
                >
                  {m.value}
                </span>
                <span className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="my-5 h-px" style={{ background: "var(--border)" }} />

        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t, ti) => {
            const c = techColor(t, ti);
            return (
              <span
                key={t}
                className="rounded-lg px-2.5 py-0.5 text-[10px] font-semibold"
                style={{
                  background: `${c}18`,
                  border: `1px solid ${c}35`,
                  color: c,
                }}
              >
                {t}
              </span>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2 text-xs font-bold transition-all duration-300 hover:scale-105"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            Live site ↗
          </a>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border px-5 py-2 text-xs font-medium transition-all duration-300 hover:border-white/20 hover:text-white"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              GitHub
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="group/link ml-auto flex items-center gap-1.5 rounded-lg border px-5 py-2 text-xs font-semibold transition-all duration-300 hover:border-accent/40 hover:text-accent"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            Details
            <svg
              width="11" height="11" viewBox="0 0 16 16" fill="none"
              className="transition-transform duration-200 group-hover/link:translate-x-1"
            >
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      className="border-t py-24 md:py-32"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="My Work" title="{Projects} I've shipped" />
          <div className="max-w-sm text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <FramerBlurWordReveal text="Live apps across travel, e-commerce, logistics, and education — each deployed and ready to explore." delay={0.25} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {projects.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
