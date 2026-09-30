"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { site } from "@/data/site";
import { GitHubActivity } from "@/components/GitHubActivity";

const stats = [
  { end: 1,   suffix: "+", label: "Year Experience", bg: "var(--nb-pink)",   tilt: "-rotate-1" },
  { end: 10,  suffix: "+", label: "Projects Shipped", bg: "var(--nb-blue)",   tilt: "rotate-1" },
  { end: 20,  suffix: "+", label: "Technologies",     bg: "var(--nb-green)",  tilt: "rotate-1" },
  { end: 100, suffix: "%", label: "Remote Ready",     bg: "var(--nb-orange)", tilt: "-rotate-1" },
];

export function About() {
  const reduceMotion = useReducedMotion();
  const statsRef = useRef<HTMLDivElement>(null);

  /* ── GSAP stat counters ── */
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
        duration: 2,
        ease: "power2.out",
        delay: 0.2 + i * 0.1,
        onUpdate() { el.textContent = String(Math.round(obj.val)); },
      });
    });
    return () => { tweens.forEach((t) => t.kill()); };
  }, [reduceMotion]);

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* ── Two-column layout ── */}
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">

          {/* Left — big editorial text */}
          <div>
            <p className="nb-tag mb-6 -rotate-1 bg-surface px-3 py-1 font-mono text-xs uppercase tracking-[0.2em]">
              <span className="h-2 w-2 rounded-full bg-ink" />
              About Me
            </p>

            <h2 className="font-display mb-6 text-[clamp(1.8rem,3.6vw,2.9rem)] uppercase leading-[1.1] select-none">
              <div>I turn complex</div>
              <div className="mt-1">ideas into</div>
              <div className="my-3">
                <span className="nb-mark rotate-[-1.5deg] px-3 py-1">production-ready</span>
              </div>
              <div>software.</div>
            </h2>

            <div className="mt-6 text-base font-medium leading-relaxed text-muted">
              <p>
                I&apos;m {site.name}, a {site.role.toLowerCase()} who cares about clean architecture, intuitive interfaces, and shipping work that scales — whether it&apos;s a customer-facing app, an internal dashboard, or APIs powering multiple clients.
              </p>
              <p className="mt-4">
                When I&apos;m not coding, I&apos;m exploring new tools, contributing to open source, or deep in side projects that push my skills further.
              </p>
            </div>

            {/* Social links */}
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {[
                { label: "GitHub", href: site.github },
                { label: "LinkedIn", href: site.linkedin },
                { label: "Email", href: `mailto:${site.email}` },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="nb-btn bg-surface px-5 py-2 text-sm hover:bg-accent"
                >
                  {link.label} ↗
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right — stats */}
          <div className="lg:pt-14">
            {/* Open to work badge */}
            <motion.div
              className="nb-tag mb-8 rotate-1 bg-nb-green px-4 py-2"
              initial={reduceMotion ? false : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.span
                className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-surface"
                animate={reduceMotion ? undefined : { scale: [1, 1.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <span className="text-xs font-extrabold uppercase tracking-widest">
                Open to Work
              </span>
              <span className="text-xs font-semibold">
                · Remote / Freelance
              </span>
            </motion.div>

            {/* Stats grid */}
            <div ref={statsRef} className="grid grid-cols-2 gap-5">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 280, damping: 20, delay: i * 0.08 }}
                >
                  <div className={`nb-card nb-hover h-full p-5 sm:p-6 ${s.tilt}`} style={{ background: s.bg }}>
                  <div className="flex items-end gap-0.5">
                    <span
                      className="font-display text-5xl tabular-nums"
                      data-count={s.end}
                    >
                      0
                    </span>
                    <span className="font-display mb-1 text-2xl">
                      {s.suffix}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-extrabold uppercase tracking-wide">
                    {s.label}
                  </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub activity */}
        <GitHubActivity />
      </div>
    </section>
  );
}
