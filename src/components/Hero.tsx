"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MarqueeServices } from "@/components/MarqueeServices";
import { ResumeModal } from "@/components/ResumeModal";
import { TypewriterGradient } from "@/components/motion/TypewriterGradient";
import { Framer3DWordFlip, FramerBlurWordReveal } from "@/components/TextReveal";
import { HeroCodeTerminal } from "@/components/HeroCodeTerminal";
import { site } from "@/data/site";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <>
      <section
        id="hero"
        className="relative flex min-h-screen flex-col justify-between"
        style={{ background: "var(--background)", paddingTop: "calc(72px + 16px)" }}
      >
        {/* ── Main hero content ── */}
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-0 pt-20 md:px-10 md:pt-28">

          {/* Bangladeshi Badge — compact tight width with Glaze / Sheen effect */}
          <motion.div
            className="group relative overflow-hidden mb-5 inline-flex w-fit self-start items-center gap-3 rounded-2xl border p-2.5 px-4 shadow-md backdrop-blur-xl transition-all duration-300 hover:border-accent/40"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(17,17,17,0.75)",
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Animated Glaze / Light Sheen Sweep Overlay */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-10 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
              animate={reduceMotion ? undefined : { x: ["-100%", "300%"] }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                repeatDelay: 1.8,
                ease: "easeInOut",
              }}
              aria-hidden
            />

            {/* Rounded Square BD Flag Icon */}
            <div
              className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm"
              style={{ background: "#006A4E", border: "1px solid rgba(255,255,255,0.12)" }}
              aria-label="Bangladesh Flag"
            >
              <div className="h-4.5 w-4.5 rounded-full" style={{ background: "#F42A41" }} />
            </div>

            {/* Text Stack */}
            <div className="flex flex-col text-left leading-tight">
              <p className="text-xs font-extrabold uppercase tracking-wider text-white">
                I AM FROM{" "}
                <span style={{ color: "#F42A41" }}>B</span>
                <span style={{ color: "#ffffff" }}>ANGLADE</span>
                <span style={{ color: "#10b981" }}>SH</span>
              </p>
              <p className="mt-0.5 text-[11px] font-semibold" style={{ color: "#888888" }}>
                #Bangladesh
              </p>
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            className="mb-6 flex items-center gap-3"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--accent)" }}
              animate={reduceMotion ? undefined : { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span
              className="font-mono text-xs uppercase tracking-[0.25em]"
              style={{ color: "var(--accent)" }}
            >
              Full Stack Developer
            </span>
          </motion.div>

          {/* Giant headline + photo */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

            {/* Headline */}
            <div className="max-w-4xl">
              <h1 className="text-[clamp(2.6rem,7vw,7rem)] font-bold leading-[1.1] tracking-tighter" style={{ color: "var(--foreground)" }}>
                <div>
                  <Framer3DWordFlip text="Building" delay={0.1} />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-5">
                  <span className="text-[#a78bfa] sm:text-shimmer font-bold">
                    <Framer3DWordFlip text="Digital" delay={0.25} />
                  </span>
                  
                  {/* Inline Small Avatar Badge (hidden on mobile, rounded-2xl on sm+) */}
                  <motion.span
                    className="hidden sm:inline-flex relative overflow-hidden rounded-2xl border border-white/25 shadow-[0_8px_25px_rgba(0,0,0,0.5)] h-[1.05em] w-[1.35em] align-middle translate-y-[0.12em]"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.8, rotate: -4 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={site.profileImage}
                      alt={site.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: "center 25%" }}
                      sizes="160px"
                      priority
                    />
                    {/* Continuous Sheen Overlay */}
                    <motion.span
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-20deg]"
                      animate={reduceMotion ? undefined : { x: ["-100%", "200%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.span>
                </div>
                <div>
                  <Framer3DWordFlip text="Products." delay={0.38} />
                </div>
              </h1>

              {/* Typewriter role */}
              <motion.div
                className="mt-6 text-xl font-semibold sm:text-2xl"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <TypewriterGradient />
              </motion.div>

              {/* Description — Framer Blur Word Reveal */}
              <div className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--muted)" }}>
                <FramerBlurWordReveal text={site.tagline} delay={0.5} />
              </div>

              {/* CTAs — Side-by-Side on mobile */}
              <motion.div
                className="mt-8 flex flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 }}
              >
                <motion.a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group relative overflow-hidden flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-2.5 rounded-lg px-4 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold shadow-lg transition-all duration-300 whitespace-nowrap"
                  style={{
                    background: "var(--foreground)",
                    color: "var(--background)",
                  }}
                  whileHover={reduceMotion ? undefined : { scale: 1.05, y: -2, boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                  whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                >
                  {/* Dynamic Sheen Beam Sweep (Continuous) */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 z-10 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                    animate={reduceMotion ? undefined : { x: ["-100%", "300%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2.0,
                      ease: "easeInOut",
                    }}
                    aria-hidden
                  />
                  <span className="relative z-10">Let&apos;s Talk</span>
                  <svg
                    width="14" height="14" viewBox="0 0 16 16" fill="none"
                    className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.a>

                <motion.button
                  onClick={() => setResumeOpen(true)}
                  className="group relative overflow-hidden flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border px-4 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-semibold transition-all duration-300 hover:border-white/40 hover:text-white whitespace-nowrap"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--muted)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                  whileHover={reduceMotion ? undefined : { scale: 1.04, y: -2, background: "rgba(255,255,255,0.08)" }}
                  whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                >
                  {/* Dynamic Sheen Beam Sweep (Continuous) */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 z-10 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                    animate={reduceMotion ? undefined : { x: ["-100%", "300%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2.2,
                      ease: "easeInOut",
                    }}
                    aria-hidden
                  />
                  <span className="relative z-10">View Resume</span>
                </motion.button>
              </motion.div>
            </div>

            {/* Right Column: Code Editor Mockup Terminal */}
            <div className="flex-shrink-0 self-center lg:self-auto w-full lg:w-fit flex justify-center mt-8 lg:mt-0">
              <HeroCodeTerminal />
            </div>
          </div>
        </div>

        {/* ── Marquee services strip ── */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-14"
        >
          <MarqueeServices />
        </motion.div>
      </section>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
