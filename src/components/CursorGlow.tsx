"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorGlow() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  /* Raw positions */
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);

  /* Outer ring — slow spring (lags behind) */
  const ringX = useSpring(x, { stiffness: 80,  damping: 22, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 80,  damping: 22, mass: 0.6 });

  /* Inner dot — fast spring (follows closely) */
  const dotX = useSpring(x, { stiffness: 200, damping: 28, mass: 0.3 });
  const dotY = useSpring(y, { stiffness: 200, damping: 28, mass: 0.3 });

  /* Large ambient glow — very slow */
  const glowX = useSpring(x, { stiffness: 40, damping: 20, mass: 1 });
  const glowY = useSpring(y, { stiffness: 40, damping: 20, mass: 1 });

  useEffect(() => {
    if (reduceMotion) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    /* Detect interactive elements for hover state */
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [role='button'], input, textarea, select, label, [data-magnetic]")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [reduceMotion, x, y]);

  if (reduceMotion) return null;

  const opacity = visible ? 1 : 0;

  return (
    <>
      {/* ── Large ambient glow ── */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-0 mix-blend-normal"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(45,212,191,0.10) 0%, rgba(45,212,191,0.04) 35%, rgba(45,212,191,0.01) 60%, transparent 75%)",
          opacity,
          transition: "opacity 0.5s ease",
        }}
        aria-hidden
      />

      {/* ── Outer ring — lags behind cursor ── */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? "52px" : "38px",
          height: isHovering ? "52px" : "38px",
          borderRadius: "50%",
          border: isHovering
            ? "1.5px solid rgba(45,212,191,0.85)"
            : "1.5px solid rgba(45,212,191,0.45)",
          boxShadow: isHovering
            ? "0 0 16px rgba(45,212,191,0.5), inset 0 0 8px rgba(45,212,191,0.15)"
            : "none",
          background: isHovering
            ? "rgba(45,212,191,0.06)"
            : "transparent",
          opacity,
          transition:
            "width 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.35s, box-shadow 0.35s, background 0.35s, opacity 0.4s",
          mixBlendMode: "normal",
        }}
        aria-hidden
      />

      {/* ── Inner dot — follows cursor closely ── */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? "6px" : "5px",
          height: isHovering ? "6px" : "5px",
          borderRadius: "50%",
          background: "rgba(45,212,191,1)",
          boxShadow: "0 0 8px rgba(45,212,191,0.9)",
          opacity: isHovering ? 0 : opacity,
          transition: "opacity 0.25s, width 0.2s, height 0.2s",
        }}
        aria-hidden
      />
    </>
  );
}
