"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { SectionHeading } from "@/components/SectionHeading";

const PILL_COLORS = ["var(--nb-yellow)", "var(--nb-pink)", "var(--nb-blue)", "var(--nb-green)", "var(--nb-orange)", "var(--nb-purple)"];

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const reduceMotion = useReducedMotion();
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 220, damping: 24, delay: index * 0.05 }}
    >
      <article className="nb-card nb-hover group grid grid-cols-1 overflow-hidden md:grid-cols-2">
        {/* Image side */}
        <div
          className={`relative overflow-hidden border-b-[3px] border-ink bg-surface-2 md:border-b-0 ${
            isEven ? "md:order-1 md:border-r-[3px]" : "md:order-2 md:border-l-[3px]"
          }`}
          style={{ minHeight: "320px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Index badge */}
          <div className="absolute left-4 top-4">
            <span className="nb-tag bg-accent px-2.5 py-1 font-mono text-sm">
              #{String(index + 1).padStart(2, "0")}
            </span>
          </div>
          {index === 0 && (
            <div className="absolute right-4 top-4">
              <span className="nb-tag rotate-3 bg-nb-pink px-2.5 py-1 text-[11px] uppercase tracking-widest">
                ★ Featured
              </span>
            </div>
          )}
        </div>

        {/* Content side */}
        <div className={`flex flex-col justify-center p-7 md:p-9 ${isEven ? "md:order-2" : "md:order-1"}`}>
          {/* Title */}
          <h3 className="font-display text-2xl uppercase leading-tight md:text-3xl">
            {project.title}
          </h3>

          {/* Description */}
          <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-muted">
            {project.description}
          </p>

          {/* Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="rounded-lg border-2 border-ink bg-surface-2 px-3 py-1.5">
                  <span className="font-display block text-lg leading-none">{m.value}</span>
                  <span className="mt-0.5 block text-[10px] font-bold uppercase">{m.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="my-5 h-[3px] bg-ink" />

          {/* Tech pills */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t, ti) => (
              <span
                key={t}
                className="rounded-md border-2 border-ink px-2.5 py-0.5 text-[11px] font-bold"
                style={{ background: PILL_COLORS[ti % PILL_COLORS.length] }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nb-btn bg-accent px-5 py-2 text-xs uppercase tracking-wide"
            >
              Live site ↗
            </a>
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nb-btn bg-surface px-5 py-2 text-xs uppercase tracking-wide"
              >
                GitHub
              </a>
            )}
            <Link
              href={`/projects/${project.slug}`}
              className="nb-btn group/link ml-auto bg-ink px-5 py-2 text-xs uppercase tracking-wide text-white"
            >
              Details
              <svg
                width="12" height="12" viewBox="0 0 16 16" fill="none"
                className="transition-transform duration-200 group-hover/link:translate-x-1"
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="My Work" title="{Projects} I've shipped" />
          <p className="max-w-sm text-sm font-medium leading-relaxed text-muted">
            Live apps across travel, e-commerce, logistics, and education — each deployed and ready to explore.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {projects.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
