"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode, MouseEvent } from "react";

type Dir = "top" | "bottom" | "left" | "right";

function getEntryDir(e: MouseEvent<HTMLElement>): Dir {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const w = rect.width;
  const h = rect.height;
  const d = { top: y, bottom: h - y, left: x, right: w - x };
  return (Object.keys(d) as Dir[]).reduce((a, b) => (d[a] < d[b] ? a : b));
}

const slideOut: Record<Dir, string> = {
  top: "translateY(-100%)",
  bottom: "translateY(100%)",
  left: "translateX(-100%)",
  right: "translateX(100%)",
};

type ShutterButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
} & (
  | { href: string; onClick?: never; type?: never }
  | { href?: never; onClick: () => void; type?: "button" | "submit" }
  | { href?: never; onClick?: never; type: "submit" }
);

export function ShutterButton({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  href,
  onClick,
  type = "button",
}: ShutterButtonProps) {
  const [dir, setDir] = useState<Dir>("bottom");
  const [hovered, setHovered] = useState(false);

  const base =
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold";

  const variantClasses =
    variant === "primary"
      ? "border border-accent/50 text-accent"
      : "border border-white/20 text-white";

  const fillColor = variant === "primary" ? "bg-accent" : "bg-white";

  const handleMouseEnter = (e: MouseEvent<HTMLElement>) => {
    setDir(getEntryDir(e));
    setHovered(true);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLElement>) => {
    setDir(getEntryDir(e));
    setHovered(false);
  };

  const handlers = { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave };

  const content = (
    <>
      <span
        className={`pointer-events-none absolute inset-0 ${fillColor}`}
        style={{
          transform: hovered ? "translate(0, 0)" : slideOut[dir],
          transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        aria-hidden
      />
      <span
        className="relative z-10 transition-colors duration-300"
        style={{ color: hovered ? "#0b0f14" : undefined }}
      >
        {children}
      </span>
    </>
  );

  const classes = `${base} ${variantClasses} ${className} ${disabled ? "pointer-events-none opacity-50" : ""}`;

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...handlers}>
          {content}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={classes}
        {...handlers}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          if (href.startsWith("#")) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...handlers}>
      {content}
    </button>
  );
}
