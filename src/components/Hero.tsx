"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroBackground } from "@/components/HeroBackground";
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
      <section className="relative flex h-full min-h-0 flex-col justify-center overflow-hidden pt-28 pb-24">
        <HeroBackground />

        <motion.div
          className="relative mx-auto flex max-w-6xl flex-col items-center px-6 text-center"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-accent/25 shadow-[0_0_40px_-8px_rgba(45,212,191,0.45)] ring-2 ring-white/10 sm:h-44 sm:w-44 md:h-52 md:w-52">
              <Image
                src={site.profileImage}
                alt={`${site.name} — profile photo`}
                fill
                priority
                sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
                className="object-cover object-[center_35%]"
              />
            </div>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300"
          >
            <motion.span
              className="h-2 w-2 rounded-full bg-accent"
              animate={reduceMotion ? undefined : { scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {site.location}
          </motion.p>

          <motion.h1
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            Hi, I&apos;m {site.name}
            <span className="mt-2 block text-2xl font-semibold sm:text-3xl md:text-4xl">
              <TypewriterGradient />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl"
          >
            {site.tagline}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <ShutterButton variant="primary" onClick={() => setResumeOpen(true)}>
              My Resume
            </ShutterButton>
            <ShutterButton variant="secondary" href="#contact">
              Hire Me
            </ShutterButton>
          </motion.div>
        </motion.div>
      </section>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
