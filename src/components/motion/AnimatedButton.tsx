"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  target?: string;
  rel?: string;
};

export function AnimatedButton({
  href,
  children,
  className = "",
  variant = "primary",
  target,
  rel,
}: AnimatedButtonProps) {
  const reduceMotion = useReducedMotion();

  const base =
    variant === "primary"
      ? "rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-[#0b0f14]"
      : "rounded-lg border border-black/15 px-6 py-3 text-sm font-medium text-foreground/80 hover:border-black/30 hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/5";

  const motionProps = reduceMotion
    ? {}
    : {
        whileHover: { scale: 1.05, y: -2 },
        whileTap: { scale: 0.97 },
        transition: { type: "spring" as const, stiffness: 400, damping: 22 },
      };

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      className={`${base} inline-flex items-center justify-center ${className}`}
      {...motionProps}
    >
      {children}
    </motion.a>
  );
}
