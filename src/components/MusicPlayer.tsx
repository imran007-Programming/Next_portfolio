"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const TRACK_SRC = "/music/kontraa-water-afro-pop-music-445661.mp3";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(TRACK_SRC);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying((p) => !p);
  }, [playing]);

  return (
    <motion.div
      className="fixed top-5 right-4 z-[60] sm:right-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
    >
      <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 py-2 backdrop-blur-lg dark:border-white/10 dark:bg-[#0b0f14]/90">
      {/* Equalizer bars */}
      <div className="flex items-end gap-[3px] h-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-accent"
            animate={
              playing
                ? { height: ["3px", `${10 + i * 2}px`, "3px"] }
                : { height: "3px" }
            }
            transition={
              playing
                ? {
                    duration: 0.6 + i * 0.1,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: "easeInOut",
                  }
                : { duration: 0.3 }
            }
          />
        ))}
      </div>

      {/* Track label */}
      <span className="text-[10px] font-medium text-muted hidden sm:block">
        {playing ? "Now Playing" : "Play Music"}
      </span>

      {/* Play/Pause button */}
      <button
        type="button"
        aria-label={playing ? "Pause music" : "Play music"}
        onClick={toggle}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-accent text-white transition-transform hover:scale-110 active:scale-95 dark:text-[#0b0f14]"
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      </div>
    </motion.div>
  );
}
