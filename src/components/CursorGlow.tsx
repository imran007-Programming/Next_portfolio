"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorGlow() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);

  const springX = useSpring(x, { stiffness: 120, damping: 28, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (reduceMotion) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [reduceMotion, x, y]);

  if (reduceMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-1 mix-blend-normal"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        width: "900px",
        height: "900px",
        borderRadius: "50%",
        background:
          "radial-gradient(circle at center, rgba(45,212,191,0.15) 0%, rgba(45,212,191,0.06) 30%, rgba(45,212,191,0.02) 55%, transparent 70%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
      aria-hidden
    />
  );
}
