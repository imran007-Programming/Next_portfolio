"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { site } from "@/data/site";

type ResumeModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ResumeModal({ open, onClose }: ResumeModalProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Resume preview"
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close resume preview"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-10 flex h-[min(90vh,820px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-surface shadow-2xl dark:border-white/10"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
              <h3 className="font-semibold text-foreground">Resume Preview</h3>
              <div className="flex items-center gap-3">
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-sm font-medium text-accent hover:underline"
                >
                  Open in Drive
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-black/15 text-muted transition-colors hover:border-black/30 hover:text-foreground dark:border-white/15 dark:hover:border-white/30"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <iframe
              src={site.resumePreviewUrl}
              title="Imran full stack resume"
              className="h-full w-full flex-1 bg-white"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
