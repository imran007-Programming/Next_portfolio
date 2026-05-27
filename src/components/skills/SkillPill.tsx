"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Skill } from "@/data/skills";
import { SkillIcon, SkillIconStack, usesStackedIcon } from "./SkillIcon";

type SkillPillProps = {
  skill: Skill;
  index: number;
};

export function SkillPill({ skill, index }: SkillPillProps) {
  const reduceMotion = useReducedMotion();
  const stacked = usesStackedIcon(skill.id);

  return (
    <motion.li
      className="list-none"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
    >
      <div className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0b0f14]/50 px-4 py-2.5 transition-all hover:border-white/20 hover:bg-white/5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5"
          style={{ color: skill.color }}
        >
          {stacked ? (
            <SkillIconStack className="text-sm" />
          ) : (
            <SkillIcon id={skill.id} className="text-lg" />
          )}
        </span>
        <span className="text-sm font-medium text-zinc-200">{skill.name}</span>
      </div>
    </motion.li>
  );
}
