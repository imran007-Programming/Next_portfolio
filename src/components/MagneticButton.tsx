"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Wraps any element with a "magnetic" hover effect.
 * The child shifts toward the cursor when hovering nearby.
 */
export function MagneticButton({
  children,
  className = "",
  strength = 0.38,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(ref.current, {
        x: dx,
        y: dy,
        duration: 0.4,
        ease: "power3.out",
      });
    },
    [reduceMotion, strength]
  );

  const onLeave = useCallback(() => {
    if (reduceMotion || !ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
