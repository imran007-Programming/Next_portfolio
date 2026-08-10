"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TRACK_SRC = "/music/kontraa-water-afro-pop-music-445661.mp3";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const audio = new Audio(TRACK_SRC);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); } else { audio.play().catch(() => {}); }
    setPlaying((p) => !p);
  }, [playing]);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[80]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="flex items-center gap-3 rounded-2xl p-3"
        style={{
          background: "rgba(14,14,14,0.90)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: playing
            ? "0 0 24px rgba(45,212,191,0.2), 0 8px 32px rgba(0,0,0,0.4)"
            : "0 8px 32px rgba(0,0,0,0.4)",
          transition: "box-shadow 0.4s ease",
        }}
      >
        {/* Equalizer bars — always visible */}
        <div className="flex items-end gap-[3px] h-5 w-7">
          {[0.4, 0.7, 1, 0.6, 0.85].map((scale, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full flex-shrink-0"
              style={{ background: "var(--accent)" }}
              animate={
                playing
                  ? { height: ["3px", `${Math.round(16 * scale)}px`, "3px"] }
                  : { height: "3px" }
              }
              transition={
                playing
                  ? { duration: 0.55 + i * 0.08, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }
                  : { duration: 0.3 }
              }
            />
          ))}
        </div>

        {/* Expanded label */}
        <AnimatePresence>
          {expanded && (
            <motion.span
              className="text-[11px] font-medium whitespace-nowrap overflow-hidden"
              style={{ color: "var(--muted)" }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {playing ? "Now Playing" : "Play Music"}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Play/Pause button */}
        <motion.button
          type="button"
          aria-label={playing ? "Pause music" : "Play music"}
          onClick={toggle}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-transform"
          style={{
            background: playing ? "var(--accent)" : "rgba(255,255,255,0.08)",
            color: playing ? "#080808" : "var(--foreground)",
            border: "none",
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          {playing ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1.5" />
              <rect x="14" y="4" width="4" height="16" rx="1.5" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
