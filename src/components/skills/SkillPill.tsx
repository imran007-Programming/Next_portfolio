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
      <div className="group flex items-center gap-2.5 rounded-lg border border-black/10 bg-surface px-4 py-2.5 transition-all hover:border-black/20 hover:bg-black/5 dark:border-white/10 dark:bg-surface dark:hover:border-white/20 dark:hover:bg-white/5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-black/4 dark:border-white/10 dark:bg-white/5"
          style={{ color: skill.color }}
        >
          {stacked ? (
            <SkillIconStack className="text-sm" />
          ) : (
            <SkillIcon id={skill.id} className="text-lg" />
          )}
        </span>
        <span className="text-sm font-medium text-foreground">{skill.name}</span>
      </div>
    </motion.li>
  );
}
