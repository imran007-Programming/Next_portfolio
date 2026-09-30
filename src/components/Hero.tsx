"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SiReact, SiNodedotjs, SiTypescript, SiNextdotjs } from "react-icons/si";
import { ResumeModal } from "@/components/ResumeModal";
import { TypewriterGradient } from "@/components/motion/TypewriterGradient";
import { site } from "@/data/site";

const pop = { type: "spring" as const, stiffness: 300, damping: 18 };

/** Draggable stickers scattered around the headline (desktop only) */
const stickers = [
  { id: "react", label: "React", Icon: SiReact, bg: "var(--nb-blue)", pos: "left-[6%] top-[6%]", rotate: -12 },
  { id: "next", label: "Next.js", Icon: SiNextdotjs, bg: "var(--surface)", pos: "right-[8%] top-[4%]", rotate: 8 },
  { id: "ts", label: "TypeScript", Icon: SiTypescript, bg: "var(--nb-pink)", pos: "right-[4%] bottom-[24%]", rotate: -6 },
  { id: "node", label: "Node.js", Icon: SiNodedotjs, bg: "var(--nb-green)", pos: "left-[5%] bottom-[18%]", rotate: 10 },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [resumeOpen, setResumeOpen] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

  const rise = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { ...pop, delay },
  });

  return (
    <>
      <section
        id="hero"
        className="relative flex min-h-screen flex-col justify-between pb-12"
        style={{ paddingTop: "calc(72px + 40px)" }}
      >
        {/* ── Poster area (stickers are constrained to it) ── */}
        <div ref={areaRef} className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 pb-6 text-center md:px-10">

          {/* Floating draggable stickers */}
          {stickers.map((s, i) => (
            <motion.div
              key={s.id}
              className={`absolute z-20 hidden lg:block ${s.pos}`}
              initial={reduceMotion ? false : { opacity: 0, scale: 0, rotate: s.rotate * 3 }}
              animate={{ opacity: 1, scale: 1, rotate: s.rotate }}
              transition={{ ...pop, delay: 0.7 + i * 0.1 }}
              drag
              dragConstraints={areaRef}
              dragElastic={0.2}
              whileHover={{ scale: 1.08 }}
              whileDrag={{ scale: 1.15, rotate: 0, cursor: "grabbing" }}
              style={{ cursor: "grab" }}
            >
              <div
                className="flex select-none items-center gap-2 rounded-xl border-[3px] border-ink px-4 py-2.5 text-base font-bold shadow-[4px_4px_0_0_#0a0a0a]"
                style={{ background: s.bg }}
              >
                <s.Icon className="text-xl" />
                {s.label}
              </div>
            </motion.div>
          ))}

          {/* Spinning star sticker */}
          <motion.div
            className="absolute bottom-[4%] right-[16%] z-10 hidden lg:block"
            initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...pop, delay: 1.1 }}
          >
            <svg
              width="92" height="92" viewBox="0 0 100 100"
              style={reduceMotion ? undefined : { animation: "spin 12s linear infinite" }}
              aria-hidden
            >
              <path
                d="M50 2 L61 34 L95 27 L70 52 L92 80 L58 72 L50 98 L42 72 L8 80 L30 52 L5 27 L39 34 Z"
                fill="var(--accent)" stroke="#0a0a0a" strokeWidth="4" strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* Intro tags */}
          <motion.div
            className="relative z-10 flex flex-wrap items-center justify-center gap-3"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={pop}
          >
            <span className="nb-tag -rotate-2 bg-surface px-3.5 py-1.5 text-sm">
              👋 Hi, I&apos;m {site.name} — from Bangladesh
              <span className="ml-1 inline-flex h-4 w-6 items-center justify-center rounded-sm border-2 border-ink bg-[#006A4E]">
                <span className="h-2 w-2 rounded-full bg-[#F42A41]" />
              </span>
            </span>
            <span className="nb-tag rotate-2 bg-nb-green px-3 py-1.5 font-mono text-xs uppercase tracking-wider">
              <motion.span
                className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-surface"
                animate={reduceMotion ? undefined : { scale: [1, 1.35, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              Open to work
            </span>
          </motion.div>

          {/* Giant headline */}
          <h1 className="font-display relative z-10 mt-10 text-[clamp(2.1rem,6.2vw,5.4rem)] uppercase leading-[0.95]">
            <span className="block">Full Stack</span>

            <span className="mt-4 block">
              <span className="nb-mark inline-block -rotate-2 px-[0.2em] py-[0.05em] shadow-[6px_6px_0_0_#0a0a0a]">
                Developer
              </span>
            </span>
          </h1>

          {/* Typewriter + tagline */}
          <motion.div
            className="relative z-10 mt-10 text-lg font-bold sm:text-xl"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            <TypewriterGradient />
          </motion.div>
          <p className="relative z-10 mt-3 max-w-2xl text-base font-medium leading-relaxed text-muted sm:text-lg">
            {site.tagline}
          </p>

          {/* CTAs */}
          <motion.div
            className="relative z-10 mt-9 flex w-full flex-row items-center justify-center gap-4 sm:w-auto"
            {...rise(0.75)}
          >
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="nb-btn group flex-1 whitespace-nowrap bg-ink px-5 py-3.5 text-sm text-white sm:flex-initial sm:px-9 sm:text-base"
            >
              Let&apos;s Talk
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <button
              onClick={() => setResumeOpen(true)}
              className="nb-btn flex-1 whitespace-nowrap bg-accent px-5 py-3.5 text-sm sm:flex-initial sm:px-9 sm:text-base"
            >
              View Resume
            </button>
          </motion.div>

          {/* Drag hint */}
          <p className="mt-8 hidden font-mono text-xs font-bold text-muted lg:block">
            ✦ psst… try dragging the stickers ✦
          </p>
        </div>
      </section>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
