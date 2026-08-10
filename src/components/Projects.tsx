"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { SectionHeading } from "@/components/SectionHeading";
import { Framer3DWordFlip, FramerBlurWordReveal } from "@/components/TextReveal";

const TECH_COLORS: Record<string, string> = {
  "React": "#38bdf8", "Next.js": "#a3a3a3", "TypeScript": "#60a5fa",
  "JavaScript": "#fbbf24", "Tailwind CSS": "#2dd4bf", "Vite": "#a78bfa",
  "Framer Motion": "#f472b6", "Vercel": "#94a3b8", "CSS": "#818cf8",
  "Audio API": "#34d399", "Node.js": "#86efac", "Express": "#c9d1d9",
  "Prisma": "#a5b4fc", "PostgreSQL": "#93c5fd", "MongoDB": "#6ee7b7",
  "Mongoose": "#fca5a5",
};
const FALLBACK = ["#fb923c", "#e879f9", "#4ade80", "#f87171", "#facc15"];
function techColor(name: string, idx: number) {
  return TECH_COLORS[name] ?? FALLBACK[idx % FALLBACK.length];
}

/* ── Project Card — Hovering overlays full site screenshot on top & auto-scrolls ── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const controls = useAnimation();
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (reduceMotion) return;

    // Small delay for smooth fade-in before scrolling starts
    setTimeout(() => {
      const wrap = wrapRef.current;
      const img = imgRef.current;
      if (!wrap || !img) return;
      const dist = img.offsetHeight - wrap.clientHeight;
      if (dist <= 0) return;

      controls.start({
        y: -dist,
        transition: { duration: Math.max(4, dist / 90), ease: [0.25, 0.46, 0.45, 0.94] },
      });
    }, 200);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    controls.stop();
    controls.set({ y: 0 });
  };

  return (
    <motion.article
      className="group relative overflow-hidden rounded-2xl border p-5 md:p-7 transition-all duration-500 hover:border-accent/50"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
      }}
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── CARD CONTENT (Default view) ── */}
      <div className="relative z-10 flex flex-col justify-between min-h-[170px]">
        <div>
          {/* Top row: Index & Badge */}
          <div className="mb-2 flex items-center justify-between">
            <span
              className="font-mono text-sm font-bold tabular-nums"
              style={{ color: "var(--accent)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            {index === 0 && (
              <span
                className="rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background: "rgba(139,92,246,0.2)",
                  border: "1px solid rgba(139,92,246,0.4)",
                  color: "var(--accent)",
                }}
              >
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-xl font-bold tracking-tight transition-colors duration-200 group-hover:text-accent md:text-2xl lg:text-3xl"
            style={{ color: "var(--foreground)" }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            className="mt-2 max-w-3xl text-sm leading-relaxed line-clamp-2"
            style={{ color: "var(--muted)" }}
          >
            {project.description}
          </p>

          {/* Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.metrics.map((m) => (
                <span
                  key={m.label}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    background: "rgba(139,92,246,0.12)",
                    border: "1px solid rgba(139,92,246,0.25)",
                  }}
                >
                  <span style={{ color: "var(--accent)" }}>{m.value}</span>
                  <span style={{ color: "var(--muted)", fontSize: "10px" }}>{m.label}</span>
                </span>
              ))}
            </div>
          )}

          {/* Tech pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
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
        </div>

        {/* Bottom row: Actions */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
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
          </div>

          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.05, y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="group/link flex items-center gap-1.5 rounded-lg border px-5 py-2 text-xs font-semibold transition-all duration-300 hover:border-accent/40 hover:text-accent"
              style={{ borderColor: "var(--border)", color: "var(--muted)", background: "rgba(255,255,255,0.02)" }}
            >
              Details
              <svg
                width="11" height="11" viewBox="0 0 16 16" fill="none"
                className="transition-transform duration-200 group-hover/link:translate-x-1"
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── FULL CARD IMAGE OVERLAY — Covers the text completely on hover & auto-scrolls ── */}
      <div
        ref={wrapRef}
        className={`absolute inset-0 z-20 overflow-hidden bg-[#080808] transition-all duration-500 ease-out ${
          isHovered
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-98 pointer-events-none"
        }`}
      >
        {/* Full site screenshot */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          ref={imgRef}
          animate={controls}
          src={project.image}
          alt={project.title}
          className="w-full h-auto block"
          style={{ y: 0 }}
        />

        {/* Top header overlay bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <span className="text-xs font-bold text-white px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
            {project.title} — Full Preview
          </span>
          <span className="text-[10px] font-medium text-accent flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="animate-bounce">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Auto scrolling
          </span>
        </div>

        {/* Bottom CTA overlay bar */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden inline-flex items-center gap-1.5 rounded-lg px-5 py-2 text-xs font-bold bg-accent text-[#080808] shadow-lg"
            whileHover={reduceMotion ? undefined : { scale: 1.06, y: -1, boxShadow: "0 0 20px rgba(139,92,246,0.6)" }}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <span className="relative z-10">Open Live Site ↗</span>
          </motion.a>

          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.05, y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2 text-xs font-bold bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
            >
              View Details →
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="projects"
      className="border-t py-24 md:py-32"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* Header */}
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="My Work" title="{Projects} I've shipped" />
          <div className="max-w-sm text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <FramerBlurWordReveal text="Live apps across travel, e-commerce, logistics, and education — each deployed and ready to explore." delay={0.25} />
          </div>
        </div>

        {/* Project cards list */}
        <div className="flex flex-col gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
