"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Contribution = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

function getLevelColor(level: number): string {
  if (level === 0) return "#ffffff";
  if (level === 4) return "#0a0a0a";

  // Blend the accent over white for levels 1–3
  const pct = level === 1 ? 35 : level === 2 ? 65 : 100;
  return `color-mix(in srgb, var(--accent) ${pct}%, #ffffff)`;
}

export function GitHubActivity() {
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

  const statCards = [
    { label: "Total", value: total !== null ? total.toLocaleString() : "...", bg: "var(--nb-yellow)" },
    { label: "Current Streak", value: `${streak} days`, bg: "var(--nb-pink)" },
    { label: "Daily Average", value: total !== null ? String(Math.round(total / 365)) : "...", bg: "var(--nb-blue)" },
  ];

  return (
    <div className="nb-card mt-16 overflow-hidden">
      {/* Title bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-ink bg-accent px-5 py-3">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-ink" aria-hidden>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <h3 className="font-display text-sm uppercase tracking-wide">
            GitHub Activity
          </h3>
        </div>

        <a
          href="https://github.com/imran007-Programming"
          target="_blank"
          rel="noopener noreferrer"
          className="nb-btn bg-surface px-3.5 py-1.5 text-xs uppercase tracking-wider"
        >
          View Profile ↗
        </a>
      </div>

      <div className="p-5 sm:p-6">
        {/* Stats cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              className={`rounded-lg border-[3px] border-ink p-3.5 shadow-[3px_3px_0_0_#0a0a0a] ${i === 2 ? "col-span-2 sm:col-span-1" : ""}`}
              style={{ background: s.bg }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
            >
              <p className="text-xs font-extrabold uppercase tracking-wide">{s.label}</p>
              <p className="font-display mt-1 text-2xl tabular-nums">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Contribution Graph */}
        <div className="overflow-x-auto rounded-lg border-[3px] border-ink bg-surface-2 p-4">
          <div className="flex gap-1" style={{ minWidth: "max-content" }}>
            {loading
              ? Array.from({ length: 52 }).map((_, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, di) => (
                      <div
                        key={di}
                        className="h-3 w-3 animate-pulse rounded-[3px] border border-ink/30 bg-white"
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
                        className="h-3 w-3 rounded-[3px] border-[1.5px] border-ink transition-transform duration-150 hover:scale-150"
                        style={{ background: getLevelColor(day.level) }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (wi * 0.002) + (di * 0.001) }}
                      />
                    ))}
                  </div>
                ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] font-bold">
            <span>Less</span>
            {([0, 1, 2, 3, 4] as const).map((lvl) => (
              <div
                key={lvl}
                className="h-3 w-3 rounded-[3px] border-[1.5px] border-ink"
                style={{ background: getLevelColor(lvl) }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
