"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { site } from "@/data/site";

const highlights = [
  {
    title: "End-to-end delivery",
    body: "From UI polish to APIs and databases — I own the full stack.",
  },
  {
    title: "Clean architecture",
    body: "Maintainable codebases built to scale with your team and users.",
  },
  {
    title: "Remote-ready",
    body: "Experienced collaborating async across time zones and tools.",
  },
];

export function About() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                About
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-bold text-white md:text-4xl">
                Crafting digital experiences with{" "}
                <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
                  purpose
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-sm text-zinc-500 md:text-right">
              {site.role} · Open to opportunities
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <FadeIn delay={0.05}>
            <motion.div
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/6 to-transparent p-8 md:p-10"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
                aria-hidden
              />
              <p className="text-lg leading-relaxed text-zinc-300">
                I&apos;m <span className="font-semibold text-white">{site.name}</span>
                , a {site.role.toLowerCase()} passionate about turning ideas into
                production-ready software.
              </p>
              <p className="mt-4 leading-relaxed text-zinc-400">
                I care about clear architecture, intuitive interfaces, and shipping
                work that scales — whether it&apos;s a customer-facing app, an internal
                dashboard, or APIs powering multiple clients.
              </p>
              <p className="mt-4 leading-relaxed text-zinc-400">
                Update this section with your story, years of experience, and the
                roles or projects you&apos;re looking for next.
              </p>
            </motion.div>
          </FadeIn>

          <div className="flex flex-col gap-4">
            {highlights.map((item, i) => (
              <FadeIn key={item.title} delay={0.1 + i * 0.08}>
                <motion.div
                  className="rounded-2xl border border-white/8 bg-white/2 p-5 transition-colors hover:border-accent/25 hover:bg-white/4"
                  whileHover={reduceMotion ? undefined : { x: 6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {item.body}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
