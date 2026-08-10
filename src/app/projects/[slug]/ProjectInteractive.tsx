"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/** Glow-on-hover live site button */
export function LiveButton({ href }: { href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-[#080808] transition-all duration-300"
      style={{ background: "#8b5cf6" }}
      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139,92,246,0.6)" }}
      whileTap={{ scale: 0.96 }}
    >
      <span>Live site</span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.a>
  );
}

/** Next-project card — hover border glow */
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
    <Link href={href} className="block mt-4">
      <motion.div
        className="group flex items-center justify-between rounded-2xl p-6 transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        whileHover={{
          borderColor: "rgba(139,92,246,0.4)",
          background: "rgba(139,92,246,0.05)",
          y: -2,
        }}
        transition={{ duration: 0.25 }}
      >
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: "rgba(139,92,246,0.7)" }}>
            Project {num}
          </p>
          <p className="mt-1 text-xl font-bold text-foreground group-hover:text-accent transition-colors">
            {title}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 group-hover:border-accent group-hover:bg-accent group-hover:text-[#080808] transition-all duration-300">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <path d="M5 12h14M14 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>
    </Link>
  );
}
