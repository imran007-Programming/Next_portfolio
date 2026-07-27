"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { site } from "@/data/site";
import { GitHubActivity } from "@/components/GitHubActivity";

const stats = [
  { end: 3,   suffix: "+", label: "Years Exp."    },
  { end: 10,  suffix: "+", label: "Projects"      },
  { end: 20,  suffix: "+", label: "Technologies"  },
  { end: 100, suffix: "%", label: "Remote Friendly"},
];

const highlights = [
  {
    color: "#2dd4bf",
    title: "End-to-end delivery",
    body: "From pixel-perfect UI to robust APIs and databases — I own the full stack.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    color: "#67e8f9",
    title: "Clean architecture",
    body: "Maintainable, testable codebases designed to scale with your team and users.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    color: "#a78bfa",
    title: "Remote-ready",
    body: "Seasoned async collaborator across time zones, tools, and distributed teams.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
];

export function About() {
  const reduceMotion = useReducedMotion();

  const headingRef    = useRef<HTMLHeadingElement>(null);
  const statsRef      = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);

  /* ── GSAP: word-by-word heading reveal ─────────────────────── */
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(".word");

    if (reduceMotion) {
      gsap.set(words, { y: 0, opacity: 1 });
      return;
    }

    gsap.set(words, { y: 40, opacity: 0 });
    const tween = gsap.to(words, {
      y: 0, opacity: 1,
      duration: 0.65,
      stagger: 0.06,
      ease: "power3.out",
      delay: 0.15,
    });
    return () => { tween.kill(); };
  }, [reduceMotion]);

  /* ── GSAP: stat counters ────────────────────────────────────── */
  useEffect(() => {
    const container = statsRef.current;
    if (!container) return;
    const els = container.querySelectorAll<HTMLElement>("[data-count]");

    if (reduceMotion) {
      els.forEach((el) => { el.textContent = el.dataset.count ?? ""; });
      return;
    }

    const tweens = Array.from(els).map((el, i) => {
      const end = Number(el.dataset.count);
      const obj = { val: 0 };
      return gsap.to(obj, {
        val: end,
        duration: 1.8,
        ease: "power2.out",
        delay: 0.3 + i * 0.12,
        onUpdate() { el.textContent = String(Math.round(obj.val)); },
      });
    });

    return () => { tweens.forEach((t) => t.kill()); };
  }, [reduceMotion]);

  /* ── GSAP: stagger highlights in from right ─────────────────── */
  useEffect(() => {
    const container = highlightsRef.current;
    if (!container) return;
    const cards = container.children;

    if (reduceMotion) {
      gsap.set(cards, { opacity: 1, x: 0 });
      return;
    }

    gsap.set(cards, { opacity: 0, x: 28 });
    const tween = gsap.to(cards, {
      opacity: 1, x: 0,
      duration: 0.55,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.55,
    });
    return () => { tween.kill(); };
  }, [reduceMotion]);

  const headingWords = ["Crafting", "digital", "experiences", "with"];

  return (
    <section className="h-full overflow-y-auto py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="mb-8">
          <motion.p
            className="text-sm font-semibold uppercase tracking-[0.2em] text-accent"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            About
          </motion.p>
          <motion.span
            className="mt-1.5 block h-0.5 w-8 rounded-full bg-linear-to-r from-accent to-cyan-300"
            style={{ originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [1, 2, 1] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <h2
            ref={headingRef}
            className="mt-3 max-w-lg text-3xl font-bold leading-tight text-foreground md:text-4xl"
          >
            {headingWords.map((w) => (
              <span key={w} className="word mr-[0.28em] inline-block">{w}</span>
            ))}
            <span className="word inline-block bg-linear-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
              purpose
            </span>
          </h2>
        </div>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <div
          ref={statsRef}
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-xl border border-black/8 bg-surface p-4 text-center transition-colors hover:border-accent/30 dark:border-white/8"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(45,212,191,0.08) 0%, transparent 70%)" }}
                aria-hidden
              />
              <div className="flex items-end justify-center gap-0.5">
                <span
                  className="text-3xl font-bold text-accent tabular-nums md:text-4xl"
                  data-count={s.end}
                  data-index={i}
                >
                  0
                </span>
                <span className="mb-1 text-lg font-bold text-accent">{s.suffix}</span>
              </div>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Content grid ──────────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">

          {/* Bio card */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-black/8 bg-surface p-7 dark:border-white/8 md:p-9"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Left accent bar */}
            <span className="absolute left-0 top-8 h-14 w-0.75 rounded-r-full bg-linear-to-b from-accent to-cyan-300" aria-hidden />

            {/* Glow blob */}
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-accent/8 blur-3xl"
              aria-hidden
            />

            <p className="text-base leading-relaxed text-foreground/90">
              I&apos;m{" "}
              <span className="font-semibold text-foreground">{site.name}</span>,
              a {site.role.toLowerCase()} who turns ideas into production-ready
              software — fast, reliable, and built to last.
            </p>

            <p className="mt-4 leading-relaxed text-muted">
              I care about clear architecture, intuitive interfaces, and shipping
              work that scales — whether it&apos;s a customer-facing app, an
              internal dashboard, or APIs powering multiple clients.
            </p>

            <p className="mt-4 leading-relaxed text-muted">
              When I&apos;m not coding, I&apos;m exploring new tools, contributing
              to open source, or deep in side projects that push my skills further.
            </p>

            {/* Social links */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-medium text-muted transition-all hover:border-accent/40 hover:text-accent dark:border-white/10"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-medium text-muted transition-all hover:border-accent/40 hover:text-accent dark:border-white/10"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-medium text-muted transition-all hover:border-accent/40 hover:text-accent dark:border-white/10"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Email
              </a>
            </div>
          </motion.div>

          {/* Right column */}
          <div className="flex flex-col gap-4">

            {/* Status badge */}
            <motion.div
              className="flex items-center gap-3 rounded-xl border border-accent/25 bg-accent/8 px-5 py-3.5"
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <motion.span
                className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent"
                animate={reduceMotion ? undefined : { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">
                  Open to work
                </p>
                <p className="text-xs text-muted">
                  Available for remote full-time or freelance
                </p>
              </div>
            </motion.div>

            {/* Highlights (GSAP stagger) */}
            <div ref={highlightsRef} className="flex flex-col gap-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="group relative cursor-default overflow-hidden rounded-xl border border-black/8 bg-surface p-5 transition-all duration-300 dark:border-white/8"
                  style={{ "--hc": item.color } as React.CSSProperties}
                >
                  {/* Hover border glow via JS inline style trick */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                    style={{ boxShadow: `inset 0 0 0 1px ${item.color}35` }}
                    aria-hidden
                  />
                  {/* Corner glow */}
                  <div
                    className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{ backgroundColor: `${item.color}20` }}
                    aria-hidden
                  />

                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300"
                      style={{
                        backgroundColor: `${item.color}15`,
                        color: item.color,
                      }}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* GitHub contribution heatmap */}
        <GitHubActivity />

      </div>
    </section>
  );
}
