"use client";

import { useReducedMotion } from "framer-motion";

function BDFlag() {
  return (
    <svg className="h-3 w-5 shrink-0 rounded-[2px]" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Bangladesh Flag">
      <rect width="20" height="12" fill="#006A4E" />
      <circle cx="9" cy="6" r="4" fill="#F42A41" />
    </svg>
  );
}

const items = [
  { text: "Based in Bangladesh", flag: true },
  { text: "Open to Work", flag: false },
  { text: "Full Stack Developer", flag: false },
  { text: "Remote Friendly", flag: false },
  { text: "Next.js & React", flag: false },
  { text: "Node.js & APIs", flag: false },
];

export function MarqueeBanner() {
  const reduceMotion = useReducedMotion();
  const list = [...items, ...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-b"
      style={{ borderColor: "var(--border)", background: "var(--accent)", cursor: "default", height: "32px" }}
    >
      <div
        className={reduceMotion ? "flex h-full items-center gap-8 px-4" : "marquee-track h-full items-center"}
        style={{ whiteSpace: "nowrap" }}
      >
        {list.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2.5 px-5 text-xs font-bold uppercase tracking-[0.18em]"
            style={{ color: "#080808" }}
          >
            {item.flag ? <BDFlag /> : (
              <span
                className="inline-block h-1 w-1 rounded-full"
                style={{ background: "#080808" }}
                aria-hidden
              />
            )}
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
