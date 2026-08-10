"use client";

import { FramerBlurLetters } from "@/components/TextReveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  delay?: number;
  className?: string;
}

export function SectionHeading({ eyebrow, title, delay = 0.1, className = "" }: SectionHeadingProps) {
  const parts = title.split(/(\{.*?\})/g);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>
          {eyebrow}
        </p>
      )}
      <h2
        className="flex flex-wrap items-center gap-x-[0.25em] text-[clamp(1.5rem,3.2vw,2.4rem)] font-extrabold uppercase leading-none tracking-[0.08em] select-none"
        style={{ fontFamily: "var(--font-unbounded)" }}
      >
        {parts.map((part, index) => {
          const isHighlight = part.startsWith("{") && part.endsWith("}");
          const cleanText = isHighlight ? part.slice(1, -1) : part;
          if (!cleanText) return null;
          return (
            <FramerBlurLetters
              key={index}
              text={cleanText}
              delay={delay + index * 0.05}
              className={isHighlight ? "text-accent" : "text-white"}
            />
          );
        })}
      </h2>
    </div>
  );
}
