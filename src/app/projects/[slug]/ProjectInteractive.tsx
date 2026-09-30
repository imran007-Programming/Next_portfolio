"use client";

import Link from "next/link";

/** Primary live-site button */
export function LiveButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="nb-btn group bg-accent px-7 py-3 text-sm uppercase tracking-wide"
    >
      <span>Live site</span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

/** Next-project card */
export function NextProjectCard({
  href,
  num,
  title,
}: {
  href: string;
  num: string;
  title: string;
}) {
  return (
    <Link href={href} className="nb-card nb-hover group flex items-center justify-between gap-4 p-6 hover:bg-accent">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest">
          Next · Project {num}
        </p>
        <p className="font-display mt-1 text-2xl uppercase">
          {title}
        </p>
      </div>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-[3px] border-ink bg-ink text-white transition-colors duration-150 group-hover:bg-surface group-hover:text-ink">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        >
          <path d="M5 12h14M14 6l6 6-6 6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}
