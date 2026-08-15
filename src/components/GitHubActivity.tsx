"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useColor } from "@/context/ColorContext";

type Contribution = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

function getLevelColor(level: number, accentColor: string): string {
  if (level === 0) return "rgba(255,255,255,0.04)";
  
  // Convert hex to rgba with opacity
  const hex = accentColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  if (level === 1) return `rgba(${r},${g},${b},0.2)`;
  if (level === 2) return `rgba(${r},${g},${b},0.4)`;
  if (level === 3) return `rgba(${r},${g},${b},0.7)`;
  return `rgba(${r},${g},${b},1)`;
}

export function GitHubActivity() {
  const { theme } = useColor();
  const [weeks, setWeeks] = useState<Contribution[][]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://github-contributions-api.jogruber.de/v4/imran007-Programming?y=last")
      .then((r) => r.json())
      .then((data) => {
        const contributions: Contribution[] = data.contributions ?? [];
        const totalCount: number = data.total?.lastYear ?? 0;

        // Calculate current streak
        let currentStreak = 0;
        for (let i = contributions.length - 1; i >= 0; i--) {
          if (contributions[i].count > 0) {
            currentStreak++;
          } else {
            break;
          }
        }

        const grouped: Contribution[][] = [];
        let week: Contribution[] = [];
        for (const day of contributions) {
          week.push(day);
          if (week.length === 7) {
            grouped.push(week);
            week = [];
          }
        }
        if (week.length) grouped.push(week);

        setWeeks(grouped);
        setTotal(totalCount);
        setStreak(currentStreak);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="group relative mt-6 overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:border-accent/30" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(17,17,17,0.6)", backdropFilter: "blur(10px)" }}>
      {/* Gradient glow on hover */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Header with stats */}
      <div className="relative z-10 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-4 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-accent" aria-hidden>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
              GitHub Activity
            </h3>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <motion.div
              className="rounded-xl border p-3 transition-all duration-300 hover:border-accent/40"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                Total
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums" style={{ color: "var(--accent)" }}>
                {total !== null ? total.toLocaleString() : "..."}
              </p>
            </motion.div>

            <motion.div
              className="rounded-xl border p-3 transition-all duration-300 hover:border-accent/40"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                Current Streak
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums" style={{ color: "var(--accent)" }}>
                {streak} <span className="text-sm font-normal">days</span>
              </p>
            </motion.div>

            <motion.div
              className="col-span-2 sm:col-span-1 rounded-xl border p-3 transition-all duration-300 hover:border-accent/40"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                Daily Average
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums" style={{ color: "var(--accent)" }}>
                {total !== null ? Math.round(total / 365) : "..."}
              </p>
            </motion.div>
          </div>
        </div>

        {/* View Profile Button */}
        <motion.a
          href="https://github.com/imran007-Programming"
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn relative flex shrink-0 items-center gap-2 overflow-hidden rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:border-accent/50"
          style={{ borderColor: "var(--accent)", background: "var(--accent-dim)" }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] transition-transform duration-700 ease-out group-hover/btn:translate-x-full" />
          <span className="relative" style={{ color: "var(--accent)" }}>View Profile</span>
          <svg className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: "var(--accent)" }}>
            <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </div>

      {/* Contribution Graph */}
      <div className="relative z-10 overflow-x-auto rounded-xl border p-4" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
        <div className="flex gap-1" style={{ minWidth: "max-content" }}>
          {loading
            ? Array.from({ length: 52 }).map((_, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, di) => (
                    <div
                      key={di}
                      className="h-3 w-3 animate-pulse rounded"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    />
                  ))}
                </div>
              ))
            : weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) => (
                    <motion.div
                      key={day.date}
                      title={`${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}`}
                      className="h-3 w-3 rounded transition-all duration-200 hover:scale-125 cursor-pointer"
                      style={{
                        background: getLevelColor(day.level, theme.accent),
                        border: day.level > 0 ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.05)",
                        boxShadow: day.level > 2 ? "0 0 8px var(--accent-dim)" : "none"
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (wi * 0.002) + (di * 0.001) }}
                    />
                  ))}
                </div>
              ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-2 text-[10px] font-medium" style={{ color: "var(--muted)" }}>
          <span>Less</span>
          {([0, 1, 2, 3, 4] as const).map((lvl) => (
            <div
              key={lvl}
              className="h-3 w-3 rounded"
              style={{
                background: getLevelColor(lvl, theme.accent),
                border: lvl > 0 ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.05)"
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
