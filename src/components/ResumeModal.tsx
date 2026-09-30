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
            className="absolute inset-0 bg-ink/60"
            onClick={onClose}
            aria-label="Close resume preview"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-10 flex h-[min(90vh,820px)] w-full max-w-4xl flex-col overflow-hidden rounded-xl border-[3px] border-ink bg-surface shadow-[10px_10px_0_0_#0a0a0a]"
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            <div className="flex items-center justify-between border-b-[3px] border-ink bg-accent px-5 py-3">
              <h3 className="font-display uppercase">Resume Preview</h3>
              <div className="flex items-center gap-3">
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nb-btn bg-surface px-3 py-1.5 text-xs uppercase"
                >
                  Open in Drive ↗
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="nb-btn h-9 w-9 bg-ink text-white"
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
