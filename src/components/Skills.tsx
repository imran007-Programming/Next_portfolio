"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { SkillIcon, SkillIconStack, usesStackedIcon } from "@/components/skills/SkillIcon";
import { skillCategories, skills, type Skill } from "@/data/skills";

function SkillCard({
  skill,
  entryDelay,
  flipDelay,
}: {
  skill: Skill;
  entryDelay: number;
  flipDelay: number;
}) {
  const reduceMotion = useReducedMotion();
  const stacked = usesStackedIcon(skill.id);

  return (
    <motion.div
      className="group relative cursor-default"
      style={{ perspective: "600px" }}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: entryDelay, duration: 0.3 }}
    >
      {/* Flip wrapper */}
      <motion.div
        className="relative flex flex-col items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-2 py-4 text-center"
        style={{ transformStyle: "preserve-3d" }}
        animate={
          reduceMotion
            ? undefined
            : { rotateY: [0, 180, 360] }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 1.4,
                ease: [0.4, 0, 0.6, 1],
                repeat: Infinity,
                repeatDelay: 3.5,
                delay: flipDelay,
              }
        }
        whileHover={reduceMotion ? undefined : { scale: 1.08, y: -4 }}
      >
        {/* Glow border on hover */}
        <span
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow: `0 0 18px ${skill.color}30`,
            border: `1px solid ${skill.color}45`,
          }}
        />

        {/* Icon */}
        <span
          className="text-[1.6rem] leading-none"
          style={{ color: skill.color }}
        >
          {stacked ? <SkillIconStack /> : <SkillIcon id={skill.id} />}
        </span>

        {/* Name */}
        <span className="text-[10px] font-medium leading-tight text-zinc-500 group-hover:text-zinc-300 transition-colors duration-200 line-clamp-2">
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function Skills() {
  let globalIndex = 0;

  return (
    <section className="relative border-y border-white/5 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">

        <FadeIn>
          <div className="md:flex md:items-end md:justify-between md:gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Tech Stack
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Tools & Technologies
              </h2>
            </div>
            <p className="mt-4 max-w-md text-zinc-400 md:mt-0 md:text-right">
              Organized by what I use to build interfaces, backends, and ship reliably.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 space-y-12">
          {skillCategories.map((category, catIndex) => {
            const categorySkills = skills.filter((s) => s.category === category.id);

            return (
              <FadeIn key={category.id} delay={catIndex * 0.1}>
                {/* Category label */}
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-8" style={{ backgroundColor: category.accent }} />
                  <span
                    className="text-xs font-bold uppercase tracking-[0.18em]"
                    style={{ color: category.accent }}
                  >
                    {category.title}
                  </span>
                  <span className="h-px flex-1 bg-white/5" />
                  <span className="text-xs text-zinc-600">{categorySkills.length} skills</span>
                </div>

                {/* Icon cards grid */}
                <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                  {categorySkills.map((skill, i) => {
                    const idx = globalIndex++;
                    return (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        entryDelay={catIndex * 0.06 + i * 0.04}
                        flipDelay={idx * 0.4}
                      />
                    );
                  })}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
