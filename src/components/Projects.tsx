"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useCallback } from "react";
import {
  motion, useReducedMotion, useAnimation,
  useMotionValue, useSpring, useTransform, useMotionTemplate,
} from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";

/* ── Tech colour map ─────────────────────────────────────────────── */
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

/* ── Single project card ─────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const num          = String(index + 1).padStart(2, "0");
  const reduceMotion = useReducedMotion();

  /* 3-D tilt -------------------------------------------------------- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 20 });
  const sy = useSpring(my, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8]);

  /* Glare ----------------------------------------------------------- */
  const gx    = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const gy    = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(380px at ${gx}% ${gy}%, rgba(255,255,255,0.06), transparent 70%)`;

  /* Scroll preview -------------------------------------------------- */
  const wrapRef    = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLImageElement>(null);
  const scrollAnim = useAnimation();

  const startScroll = useCallback(() => {
    if (reduceMotion) return;
    const wrap = wrapRef.current;
    const img  = imgRef.current;
    if (!wrap || !img) return;
    const dist = img.offsetHeight - wrap.clientHeight;
    if (dist <= 0) return;
    scrollAnim.start({ y: -dist, transition: { duration: 7, ease: [0.25, 0.46, 0.45, 0.94] } });
  }, [scrollAnim, reduceMotion]);

  const stopScroll = useCallback(() => {
    scrollAnim.stop();
    scrollAnim.start({ y: 0, transition: { duration: 0.8, ease: "easeOut" } });
  }, [scrollAnim]);

  return (
    <motion.div
      style={{ perspective: "1200px" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.article
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative overflow-hidden rounded-2xl border border-black/8 bg-white dark:border-white/8 dark:bg-[#0d1117]"
        onMouseMove={(e) => {
          if (reduceMotion) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseEnter={() => { if (project.scrollPreview) startScroll(); }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
          if (project.scrollPreview) stopScroll();
        }}
      >
        <div className="flex flex-col md:flex-row md:h-96">

          {/* ── Image ── */}
          {project.scrollPreview ? (
            <div
              ref={wrapRef}
              className="relative h-56 shrink-0 overflow-hidden md:w-[42%] md:h-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                ref={imgRef}
                animate={scrollAnim}
                src={project.image}
                alt={project.title}
                className="w-full h-auto block"
                style={{ y: 0 }}
              />
              <div className="pointer-events-none absolute inset-0 hidden bg-linear-to-r from-transparent to-white/50 dark:to-[#0d1117]/50 md:block" />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-white/70 dark:to-[#0d1117]/70 md:hidden" />
            </div>
          ) : (
            <div className="relative h-56 shrink-0 overflow-hidden md:w-[42%] md:h-full">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
              <div className="pointer-events-none absolute inset-0 hidden bg-linear-to-r from-transparent to-white/50 dark:to-[#0d1117]/50 md:block" />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-white/70 dark:to-[#0d1117]/70 md:hidden" />
            </div>
          )}

          {/* ── Content ── */}
          <div className="flex flex-col justify-between p-6 md:p-8 md:w-[58%]">
            <div>
              {/* Index + badge */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold tabular-nums text-foreground/20">{num}</span>
                {index === 0 && (
                  <span className="rounded-full border border-accent/40 bg-accent/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent backdrop-blur-sm">
                    Featured
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold leading-tight text-foreground md:text-2xl">
                {project.title}
              </h3>

              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                {project.description}
              </p>

              {/* Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.metrics.map((metric) => (
                    <span
                      key={metric.label}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent/8 px-2.5 py-1"
                    >
                      <span className="text-xs font-bold tabular-nums text-accent">
                        {metric.value}
                      </span>
                      <span className="text-[10px] text-muted">
                        {metric.label}
                      </span>
                    </span>
                  ))}
                </div>
              )}

              {/* Tech pills */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tech.map((t, i) => {
                  const c = techColor(t, i);
                  return (
                    <span
                      key={t}
                      style={{ background: `${c}22`, borderColor: `${c}45`, color: c }}
                      className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm"
                    >
                      {t}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-5 py-2 text-xs font-bold text-white transition-shadow hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] dark:text-[#0b0f14] dark:hover:shadow-[0_0_20px_rgba(45,212,191,0.5)]"
              >
                Live site ↗
              </a>
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-foreground/20 px-5 py-2 text-xs font-medium text-foreground/80 backdrop-blur-sm transition-colors hover:border-foreground/45 hover:text-foreground"
                >
                  <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden>
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
              <Link
                href={`/projects/${project.slug}`}
                className="ml-auto text-[11px] font-semibold text-accent/50 transition-colors hover:text-accent"
              >
                View details →
              </Link>
            </div>
          </div>
        </div>

        {/* Glare overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: glare }}
          aria-hidden
        />
      </motion.article>
    </motion.div>
  );
}

/* ── Section ─────────────────────────────────────────────────────── */
export function Projects() {
  return (
    <section className="relative border-y border-black/5 py-20 dark:border-white/5 md:py-28">
      <div className="mx-auto max-w-4xl px-6">

        {/* Header */}
        <div className="md:flex md:items-end md:justify-between md:gap-8">
          <div>
            <FadeIn>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">My Work</p>
              <motion.span
                className="mt-1.5 block h-0.5 w-8 rounded-full bg-linear-to-r from-accent to-cyan-300"
                style={{ originX: 0 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [1, 2, 1] }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </FadeIn>
            <SplitHeading className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              Projects I&apos;ve shipped
            </SplitHeading>
          </div>
          <FadeIn>
            <p className="mt-4 max-w-md text-muted md:mt-0 md:text-right">
              Live apps across travel, e-commerce, logistics, and education — each deployed and ready to explore.
            </p>
          </FadeIn>
        </div>

        {/* Cards */}
        <div className="mt-10 flex flex-col gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
