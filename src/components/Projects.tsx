"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";

function useSpotlight() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const onMouseLeave = () => setPos(null);

  const spotlightStyle: React.CSSProperties = pos
    ? { background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, rgba(45,212,191,0.10) 0%, transparent 65%)` }
    : {};

  return { onMouseMove, onMouseLeave, spotlightStyle };
}

function TechBadge({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-white/8 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
      {label}
    </span>
  );
}

function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const spotlight = useSpotlight();

  return (
    <motion.article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#0d1117] transition-all duration-300 hover:border-white/16 ${featured ? "md:flex-row" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      onMouseMove={spotlight.onMouseMove}
      onMouseLeave={spotlight.onMouseLeave}
    >
      {/* Spotlight */}
      <span
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
        style={spotlight.spotlightStyle}
        aria-hidden
      />

      {/* Image */}
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative block shrink-0 overflow-hidden bg-[#070a0e] ${
          featured ? "min-h-56 md:w-[52%]" : "aspect-video w-full"
        }`}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? "(max-width: 768px) 100vw, 52vw" : "(max-width: 768px) 100vw, 33vw"}
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/80 via-transparent to-transparent" />

        {featured && (
          <span className="absolute left-4 top-4 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
            Featured
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
          View live ↗
        </span>
      </a>

      {/* Content */}
      <div className={`flex flex-1 flex-col gap-3 p-5 ${featured ? "md:p-8 md:justify-center" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-bold text-white ${featured ? "text-xl md:text-2xl" : "text-base"}`}>
            {project.title}
          </h3>
          <span className="shrink-0 text-xs font-semibold tabular-nums text-accent/60">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p className={`leading-relaxed text-zinc-400 ${featured ? "text-sm md:text-base line-clamp-4" : "line-clamp-3 text-sm"}`}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tech.map((t) => (
            <TechBadge key={t} label={t} />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-bold text-[#0b0f14] transition-all hover:shadow-[0_0_20px_rgba(45,212,191,0.35)]"
          >
            Live site ↗
          </a>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-white/25 hover:text-white"
            >
              Source code
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const [featured, ...rest] = projects;

  return (
    <section className="relative border-y border-white/5 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">

        <FadeIn>
          <div className="md:flex md:items-end md:justify-between md:gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                My Work
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Projects I&apos;ve{" "}
                <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
                  shipped
                </span>
              </h2>
            </div>
            <p className="mt-4 max-w-md text-zinc-400 md:mt-0 md:text-right">
              Live apps across travel, e-commerce, logistics, and education —
              each deployed and ready to explore.
            </p>
          </div>
        </FadeIn>

        {/* Featured project */}
        {featured && (
          <div className="mt-12">
            <ProjectCard project={featured} index={0} featured />
          </div>
        )}

        {/* Rest of projects */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {rest.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i + 1} />
          ))}
        </div>

      </div>
    </section>
  );
}
