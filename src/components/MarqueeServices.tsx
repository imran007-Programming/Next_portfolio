"use client";

import { useReducedMotion } from "framer-motion";

const services = [
  "React & Next.js",
  "Node.js & Express",
  "TypeScript",
  "REST APIs",
  "PostgreSQL",
  "MongoDB",
  "Full Stack Engineering",
  "UI/UX Development",
  "Docker & CI/CD",
  "Framer Motion",
];

const repeated = [...services, ...services, ...services];

export function MarqueeServices() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative overflow-hidden border-y py-5"
      style={{ borderColor: "var(--border)" }}
      aria-hidden
    >
      <div
        className={reduceMotion ? "flex flex-wrap gap-6 px-6" : "marquee-track-slow"}
      >
        {repeated.map((s, i) => (
          <span
            key={i}
            className="inline-flex shrink-0 items-center gap-4 px-2 text-sm font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span
              className="inline-block h-[5px] w-[5px] rounded-full flex-shrink-0"
              style={{ background: "var(--accent)" }}
            />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
