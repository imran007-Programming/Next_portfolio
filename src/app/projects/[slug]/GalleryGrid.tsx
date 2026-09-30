"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function GalleryGrid({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() =>
    setActive((i) => (i === null ? null : (i - 1 + images.length) % images.length)), [images.length]);
  const next = useCallback(() =>
    setActive((i) => (i === null ? null : (i + 1) % images.length)), [images.length]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, prev, next]);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className="nb-card nb-hover group relative cursor-pointer overflow-hidden shadow-[4px_4px_0_0_#0a0a0a] hover:shadow-[7px_7px_0_0_#0a0a0a]"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-surface-2">
              <Image
                src={src}
                alt={`${title} screenshot ${i + 1}`}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Expand icon */}
              <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg border-[3px] border-ink bg-accent shadow-[3px_3px_0_0_#0a0a0a]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7" stroke="#0a0a0a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
              <span className="nb-tag absolute bottom-2 right-2 bg-surface px-1.5 py-0 font-mono text-[10px] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-ink/80" />

            {/* Image container */}
            <motion.div
              className="relative z-10 mx-4 max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-xl border-[3px] border-ink bg-surface shadow-[10px_10px_0_0_var(--accent)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[active]}
                alt={`${title} screenshot ${active + 1}`}
                width={1440}
                height={900}
                className="h-auto max-h-[88vh] w-full object-contain"
                priority
              />

              {/* Counter */}
              <span className="nb-tag absolute left-4 top-4 bg-accent px-3 py-1 font-mono text-xs tabular-nums">
                {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>

              {/* Close */}
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="nb-btn absolute right-4 top-4 h-9 w-9 bg-ink text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>

            {/* Prev */}
            <motion.button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="absolute left-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border-[3px] border-ink bg-accent shadow-[3px_3px_0_0_#fff]"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>

            {/* Next */}
            <motion.button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="absolute right-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border-[3px] border-ink bg-accent shadow-[3px_3px_0_0_#fff]"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
