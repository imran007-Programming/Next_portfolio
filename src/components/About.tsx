"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { site } from "@/data/site";
import { GitHubActivity } from "@/components/GitHubActivity";
import { SectionHeading } from "@/components/SectionHeading";
import { Framer3DWordFlip, FramerBlurWordReveal, FramerBlurLetters } from "@/components/TextReveal";

const stats = [
  { end: 3,   suffix: "+", label: "Years Experience" },
  { end: 10,  suffix: "+", label: "Projects Shipped" },
  { end: 20,  suffix: "+", label: "Technologies"     },
  { end: 100, suffix: "%", label: "Remote Ready"     },
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
    <section
      id="about"
      className="border-t py-24 md:py-32"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* ── Two-column layout ── */}
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">

          {/* Left — big editorial text */}
          <div>
            <h2
              className="text-[clamp(1.6rem,3.4vw,2.5rem)] font-extrabold uppercase leading-tight tracking-[0.05em] select-none mb-6"
              style={{ fontFamily: 'var(--font-unbounded)' }}
            >
              <div>
                <FramerBlurLetters 
                  text="I turn complex" 
                  delay={0.1}
                  className="text-white"
                />
              </div>
              <div className="mt-1">
                <FramerBlurLetters 
                  text="ideas into" 
                  delay={0.2}
                  className="text-white"
                />
              </div>
              <div className="mt-1">
                <FramerBlurLetters 
                  text="production-ready" 
                  delay={0.3}
                  className="text-accent"
                />
              </div>
              <div className="mt-1">
                <FramerBlurLetters 
                  text="software." 
                  delay={0.4}
                  className="text-white"
                />
              </div>
            </h2>

            <div className="mt-6 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
              <FramerBlurWordReveal text={`I'm ${site.name}, a ${site.role.toLowerCase()} who cares about clean architecture, intuitive interfaces, and shipping work that scales — whether it's a customer-facing app, an internal dashboard, or APIs powering multiple clients.`} delay={0.2} />
              <div className="mt-4">
                <FramerBlurWordReveal text="When I'm not coding, I'm exploring new tools, contributing to open source, or deep in side projects that push my skills further." delay={0.4} />
              </div>
            </div>

            {/* Social links */}
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
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
                  className="rounded-full border px-5 py-2 text-xs font-medium transition-all duration-300 hover:border-white/20 hover:text-white"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--muted)",
                  }}
                >
                  {link.label} ↗
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right — stats */}
          <div>
            {/* Open to work badge */}
            <motion.div
              className="mb-8 inline-flex items-center gap-3 rounded-full border px-5 py-2.5"
              style={{
                borderColor: "rgba(45,212,191,0.3)",
                background: "rgba(45,212,191,0.05)",
              }}
              initial={reduceMotion ? false : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                className="h-2 w-2 rounded-full"
                style={{ background: "var(--accent)" }}
                animate={reduceMotion ? undefined : { scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                Open to Work
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                · Remote / Freelance
              </span>
            </motion.div>

            {/* Stats grid */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="rounded-2xl border p-5"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={reduceMotion ? undefined : {
                    borderColor: "rgba(45,212,191,0.35)",
                    y: -2,
                  }}
                >
                  <div className="flex items-end gap-0.5">
                    <span
                      className="text-4xl font-bold tabular-nums"
                      data-count={s.end}
                      style={{ color: "var(--foreground)" }}
                    >
                      0
                    </span>
                    <span
                      className="mb-1 text-xl font-bold"
                      style={{ color: "var(--accent)" }}
                    >
                      {s.suffix}
                    </span>
                  </div>
                  <p
                    className="mt-1 text-xs font-medium uppercase tracking-wide"
                    style={{ color: "var(--muted)" }}
                  >
                    {s.label}
                  </p>
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
