"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ParticleCanvas } from "@/components/ParticleCanvas";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

export function HeroBackground() {
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const shouldAnimate = isDesktop && !reduceMotion;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,#000_50%,transparent_100%)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />

      {/* Particle canvas — interactive, desktop only */}
      {isDesktop && (
        <div className="pointer-events-auto absolute inset-0">
          <ParticleCanvas />
        </div>
      )}

      {/* Blobs — only animated on desktop */}
      <motion.div
        className="absolute -top-32 left-1/2 hidden h-105 w-180 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl sm:block"
        animate={shouldAnimate ? { scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] } : undefined}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={shouldAnimate ? { willChange: "transform, opacity" } : undefined}
      />

      <motion.div
        className="absolute top-1/3 -right-24 hidden h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl sm:block"
        animate={shouldAnimate ? { x: [0, -30, 0], y: [0, 20, 0] } : undefined}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={shouldAnimate ? { willChange: "transform" } : undefined}
      />

      <motion.div
        className="absolute bottom-0 -left-16 hidden h-48 w-48 rounded-full bg-violet-400/10 blur-3xl sm:block"
        animate={shouldAnimate ? { x: [0, 24, 0], y: [0, -16, 0] } : undefined}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={shouldAnimate ? { willChange: "transform" } : undefined}
      />
    </div>
  );
}
