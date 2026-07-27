"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeIn } from "@/components/motion/FadeIn";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { SkillIcon, SkillIconStack, usesStackedIcon } from "@/components/skills/SkillIcon";
import { skillCategories, skills, type Skill } from "@/data/skills";

gsap.registerPlugin(ScrollTrigger);

/* ── Skill card — entry handled by GSAP parent ───────────────────── */
function SkillCard({ skill, flipDelay }: { skill: Skill; flipDelay: number }) {
  const reduceMotion = useReducedMotion();
  const stacked = usesStackedIcon(skill.id);

  return (
    <div className="gsap-skill group relative cursor-default" style={{ perspective: "600px" }}>
      <motion.div
        className="relative flex flex-col items-center gap-2 rounded-xl border border-black/8 bg-black/4 px-2 py-4 text-center dark:border-white/8 dark:bg-white/3"
        style={{ transformStyle: "preserve-3d" }}
        animate={reduceMotion ? undefined : { rotateY: [0, 180, 360] }}
        transition={
          reduceMotion ? undefined : {
            duration: 1.4,
            ease: [0.4, 0, 0.6, 1],
            repeat: Infinity,
            repeatDelay: 3.5,
            delay: flipDelay,
          }
        }
        whileHover={reduceMotion ? undefined : { scale: 1.08, y: -4 }}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: `0 0 18px ${skill.color}30`, border: `1px solid ${skill.color}45` }}
        />
        <span className="text-[1.6rem] leading-none" style={{ color: skill.color }}>
          {stacked ? <SkillIconStack /> : <SkillIcon id={skill.id} />}
        </span>
        <span className="line-clamp-2 text-[10px] font-medium leading-tight text-muted transition-colors duration-200 group-hover:text-foreground">
          {skill.name}
        </span>
      </motion.div>
    </div>
  );
}

/* ── Per-category grid with GSAP scroll-triggered stagger ────────── */
function AnimatedGrid({ children, catIndex }: { children: React.ReactNode; catIndex: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    const cards = el.querySelectorAll<HTMLElement>(".gsap-skill");
    gsap.set(cards, { opacity: 0, y: 20, scale: 0.88 });

    const st = ScrollTrigger.create({
      trigger: el,
      scroller: "#skills",
      start: "top 92%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: { each: 0.04, from: "start" },
          ease: "back.out(1.3)",
          delay: catIndex * 0.04,
        });
      },
    });

    return () => st.kill();
  }, [reduceMotion, catIndex]);

  return (
    <div ref={ref} className="grid grid-cols-5 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
      {children}
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────── */
export function Skills() {
  let globalIndex = 0;

  return (
    <section className="relative border-y border-white/5 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">

        <div className="md:flex md:items-end md:justify-between md:gap-8">
          <div>
            <FadeIn>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Tech Stack</p>
              <motion.span
                className="mt-1.5 block h-0.5 w-8 rounded-full bg-linear-to-r from-accent to-cyan-300"
                style={{ originX: 0 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [1, 2, 1] }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </FadeIn>
            <SplitHeading className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              Tools &amp; Technologies
            </SplitHeading>
          </div>
          <FadeIn>
            <p className="mt-4 max-w-md text-muted md:mt-0 md:text-right">
              Organized by what I use to build interfaces, backends, and ship reliably.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 space-y-12">
          {skillCategories.map((category, catIndex) => {
            const categorySkills = skills.filter((s) => s.category === category.id);

            return (
              <FadeIn key={category.id} delay={catIndex * 0.05}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-8" style={{ backgroundColor: category.accent }} />
                  <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: category.accent }}>
                    {category.title}
                  </span>
                  <span className="h-px flex-1 bg-white/5" />
                  <span className="text-xs text-muted/60">{categorySkills.length} skills</span>
                </div>

                <AnimatedGrid catIndex={catIndex}>
                  {categorySkills.map((skill) => {
                    const idx = globalIndex++;
                    return (
                      <SkillCard key={skill.id} skill={skill} flipDelay={idx * 0.4} />
                    );
                  })}
                </AnimatedGrid>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
}
