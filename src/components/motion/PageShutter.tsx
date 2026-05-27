"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ShutterPhase } from "@/context/SectionNavigation";

const EASE = [0.65, 0, 0.35, 1] as const;
const SWEEP_DURATION = 1.5;
const STAGGER = 0.1;

type PageShutterProps = {
  phase: ShutterPhase;
  onCloseComplete: () => void;
  onOpenComplete: () => void;
};

export function PageShutter({
  phase,
  onCloseComplete,
  onOpenComplete,
}: PageShutterProps) {
  const reduceMotion = useReducedMotion();
  const isClosing = phase === "closing";

  // Framer Motion can sometimes "think" the animation is already at the end state.
  // Forcing a remount on subsequent closing cycles ensures the shutter replays.
  const [closingCycleKey, setClosingCycleKey] = useState(0);
  const isFirstClosing = useRef(true);

  useEffect(() => {
    // Keep opening phase invisible so the shutter does not replay again.
    if (phase !== "opening") return;
    const id = window.setTimeout(onOpenComplete, 0);
    return () => window.clearTimeout(id);
  }, [phase, onOpenComplete]);

  useEffect(() => {
    if (phase !== "closing") return;
    if (!isFirstClosing.current) setClosingCycleKey((k) => k + 1);
    isFirstClosing.current = false;
  }, [phase]);

  if (reduceMotion || phase === "idle") return null;

  if (!isClosing) return null;

  // Accent goes left → right first, then black + white follow right → left.
  const layers = [
    { color: "bg-accent", z: "z-10", delay: 0, dir: "ltr" as const },
    {
      color: "bg-[#020617]",
      z: "z-20",
      delay: SWEEP_DURATION * 0.45,
      dir: "rtl" as const,
    },
    {
      color: "bg-white",
      z: "z-30",
      delay: SWEEP_DURATION * 0.45 + STAGGER,
      dir: "rtl" as const,
    },
  ] as const;

  return (
    <div
      key={closingCycleKey}
      className="pointer-events-auto fixed inset-0 z-200"
      role="presentation"
      aria-hidden
    >
      {layers.map((layer, idx) => (
        <motion.div
          key={layer.z}
          className={`absolute top-0 bottom-0 ${
            layer.dir === "ltr" ? "right-full" : "left-full"
          } w-screen ${layer.z} ${layer.color}`}
          initial={{ width: "0%", x: "0%" }}
          animate={{
            width: ["0%", "100%", "100%"],
            x:
              layer.dir === "ltr"
                ? ["0%", "0%", "100%"]
                : ["0%", "0%", "-100%"],
          }}
          transition={{
            duration: SWEEP_DURATION,
            ease: EASE,
            delay: layer.delay,
            times: [0, 0.45, 1],
          }}
          onAnimationComplete={() => {
            if (idx === layers.length - 1) onCloseComplete();
          }}
        />
      ))}
    </div>
  );
}
