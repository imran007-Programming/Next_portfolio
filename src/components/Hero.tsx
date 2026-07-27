"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroBackground } from "@/components/HeroBackground";
import { HireButton } from "@/components/HireButton";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { ResumeModal } from "@/components/ResumeModal";
import { ShutterButton } from "@/components/motion/ShutterButton";
import { TypewriterGradient } from "@/components/motion/TypewriterGradient";
import { site } from "@/data/site";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <>
      <section className="relative flex min-h-[120dvh] flex-col overflow-hidden pt-28 pb-0 md:min-h-full">
        <HireButton />
        <HeroBackground />

        <motion.div
          className="relative mx-auto my-auto flex max-w-6xl flex-col items-center px-6 text-center"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={staggerContainer}
        >
          {/* ── Above image ── */}
          <motion.p
            variants={fadeInUp}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-1.5 text-sm text-foreground/70 dark:border-white/10 dark:bg-white/5"
          >
            <motion.span
              className="h-2 w-2 rounded-full bg-accent"
              animate={reduceMotion ? undefined : { scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {site.location}
          </motion.p>

          {/* ── Avatar — center of screen ── */}
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="relative mx-auto w-fit">

              {/* Spinning border light — pure CSS spin, reliable in production */}
              <div
                className="absolute -inset-0.75 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0%, transparent 65%, rgba(45,212,191,0.2) 78%, rgba(45,212,191,0.85) 88%, #2dd4bf 93%, #67e8f9 97%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(farthest-side, transparent calc(100% - 3px), black 100%)",
                  maskImage:
                    "radial-gradient(farthest-side, transparent calc(100% - 3px), black 100%)",
                  animation: "spin 3s linear infinite",
                }}
                aria-hidden
              />

              {/* Avatar image */}
              <div className="relative h-36 w-36 overflow-hidden rounded-full border border-accent/15 sm:h-44 sm:w-44 md:h-52 md:w-52">
                <Image
                  src={site.profileImage}
                  alt={`${site.name} — profile photo`}
                  fill
                  priority
                  sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
                  className="object-cover object-[center_35%]"
                />
              </div>
            </div>
          </motion.div>

          {/* ── Below image: name + animated role together ── */}
          <motion.h1
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Hi, I&apos;m{" "}
            <motion.span
              className="text-shimmer inline-block"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {site.name}
            </motion.span>
            <span className="mt-2 block text-2xl font-semibold sm:text-3xl md:text-4xl">
              <TypewriterGradient />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
          >
            {site.tagline}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <ShutterButton variant="primary" onClick={() => setResumeOpen(true)}>
              My Resume
            </ShutterButton>
            <ShutterButton variant="secondary" href="#contact">
              Hire Me
            </ShutterButton>
          </motion.div>
        </motion.div>

        <ScrollIndicator />
      </section>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
