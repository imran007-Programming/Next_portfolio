"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useColor, COLOR_THEMES } from "@/context/ColorContext";

export function ColorPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const { currentTheme, setTheme } = useColor();

  useEffect(() => {
    if (isOpen && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const dropdownWidth = 256; // w-64
      let left = r.left + r.width / 2 - dropdownWidth / 2;
      // clamp so it doesn't go off screen
      left = Math.max(8, Math.min(left, window.innerWidth - dropdownWidth - 8));
      setPos({ top: r.bottom + 10, left });
    }
  }, [isOpen]);

  const colors = Object.entries(COLOR_THEMES);

  return (
    <div className="relative">
      {/* Color Picker Button */}
      <motion.button
        ref={btnRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-300 hover:scale-105"
        style={{
          background: "var(--accent)",
          borderColor: "rgba(255,255,255,0.2)",
          boxShadow: isOpen ? "0 0 20px var(--accent-dim)" : "none",
        }}
        whileTap={{ scale: 0.95 }}
        title="Change color theme"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Color Options */}
            <motion.div
              className="fixed z-[9999] w-64 overflow-hidden rounded-xl border shadow-2xl"
              style={{
                top: pos.top,
                left: pos.left,
                background: "rgba(12,12,12,0.96)",
                borderColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(24px)",
              }}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <div className="border-b p-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                  Choose Your Color
                </h3>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  Pick a theme that matches your vibe
                </p>
              </div>

              {/* Color Grid */}
              <div className="grid grid-cols-3 gap-2 p-3">
                {colors.map(([key, theme]) => (
                  <motion.button
                    key={key}
                    onClick={() => {
                      setTheme(key);
                      setIsOpen(false);
                    }}
                    className="group relative flex flex-col items-center gap-2 rounded-lg border p-3 transition-all duration-200"
                    style={{
                      background: currentTheme === key ? `${theme.accent}15` : "rgba(255,255,255,0.02)",
                      borderColor: currentTheme === key ? theme.accent : "rgba(255,255,255,0.08)",
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Color Circle */}
                    <div
                      className="h-8 w-8 rounded-full border-2 transition-all duration-200 group-hover:scale-110"
                      style={{
                        background: theme.accent,
                        borderColor: "rgba(255,255,255,0.2)",
                        boxShadow: currentTheme === key ? `0 0 15px ${theme.accent}80` : "none",
                      }}
                    />

                    {/* Label */}
                    <span
                      className="text-[10px] font-medium text-center leading-tight"
                      style={{
                        color: currentTheme === key ? theme.accent : "var(--muted)",
                      }}
                    >
                      {theme.name.split(" ")[0]}
                    </span>

                    {/* Check Mark */}
                    {currentTheme === key && (
                      <motion.div
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full"
                        style={{ background: theme.accent }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
