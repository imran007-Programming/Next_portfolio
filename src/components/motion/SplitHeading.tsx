"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "framer-motion";

type Tag = "h1" | "h2" | "h3";

export function SplitHeading({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
}: {
  children: string;
  as?: Tag;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const words = String(children).split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    const spans = el.querySelectorAll<HTMLElement>(".sh-w");
    gsap.set(spans, { y: 40, opacity: 0 });

    const tween = gsap.to(spans, {
      y: 0,
      opacity: 1,
      duration: 0.65,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.15 + delay,
    });

    return () => { tween.kill(); };
  }, [reduceMotion, delay]);

  return (
    <div ref={ref}>
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i} className="sh-w mr-[0.24em] inline-block last:mr-0">
            {word}
          </span>
        ))}
      </Tag>
    </div>
  );
}
