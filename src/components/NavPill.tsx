"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { useSectionNavigation } from "@/context/SectionNavigation";
import { useActiveSection, type SectionId } from "@/hooks/useActiveSection";
import { navLinks, site } from "@/data/site";

const navMap: Record<string, SectionId> = {
  "#about": "about",
  "#skills": "skills",
  "#projects": "projects",
  "#contact": "contact",
};

function NavItem({
  label,
  target,
  isActive,
  onSelect,
}: {
  label: string;
  target: SectionId;
  isActive: boolean;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(target)}
      className={`relative rounded-full px-3 py-1.5 text-sm transition-colors ${
        isActive ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

export function NavPill() {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection();
  const { navigateTo, shutterPhase } = useSectionNavigation();
  const reduceMotion = useReducedMotion();
  const isBusy = shutterPhase !== "idle";

  function goTo(target: SectionId) {
    if (isBusy) return;
    navigateTo(target);
    setMenuOpen(false);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto relative">
        <motion.nav
          layout
          aria-label="Main navigation"
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-[#0b0f14]/85 px-3 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-4 sm:py-2"
          initial={false}
          animate={{
            borderColor: "rgba(45, 212, 191, 0.2)",
          }}
        >
          <motion.button
            type="button"
            layout="position"
            className="font-display shrink-0 px-2 py-1.5 text-sm font-semibold tracking-tight text-white sm:text-base"
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            onClick={() => goTo("hero")}
          >
            {site.name}
            <span className="text-accent">.</span>
          </motion.button>

          <div className="mx-0.5 hidden h-5 w-px bg-white/10 sm:block" aria-hidden />

          <ul className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const id = navMap[link.href];
              return (
                <li key={link.href}>
                  <NavItem
                    label={link.label}
                    target={id}
                    isActive={active === id}
                    onSelect={goTo}
                  />
                </li>
              );
            })}
          </ul>

          <motion.button
            type="button"
            className="ml-1 hidden shrink-0 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-[#0b0f14] md:inline-flex"
            whileHover={reduceMotion ? undefined : { scale: 1.05 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            onClick={() => goTo("contact")}
          >
            Hire me
          </motion.button>

          <motion.button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-300 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </motion.button>
        </motion.nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute left-1/2 top-[calc(100%+12px)] w-[min(100vw-2rem,320px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f14]/95 p-2 shadow-xl backdrop-blur-xl md:hidden"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <ul className="flex flex-col gap-0.5">
                {navLinks.map((link, i) => {
                  const id = navMap[link.href];
                  const isActive = active === id;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <button
                        type="button"
                        className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm ${
                          isActive ? "bg-white/10 text-white" : "text-zinc-300"
                        }`}
                        onClick={() => goTo(id)}
                      >
                        {link.label}
                      </button>
                    </motion.li>
                  );
                })}
                <li className="mt-1 border-t border-white/5 pt-1">
                  <button
                    type="button"
                    className="block w-full rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-medium text-[#0b0f14]"
                    onClick={() => goTo("contact")}
                  >
                    Hire me
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
