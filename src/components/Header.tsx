"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { useActiveSection, type SectionId } from "@/hooks/useActiveSection";
import { navLinks, site } from "@/data/site";

const navMap: Record<string, SectionId> = {
  "#about": "about",
  "#skills": "skills",
  "#projects": "projects",
  "#contact": "contact",
};

export function Header() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(11, 15, 20, 0.6)", "rgba(11, 15, 20, 0.95)"]
  );
  const headerShadow = useTransform(
    scrollY,
    [0, 80],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 8px 32px rgba(0,0,0,0.35)"]
  );

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5 backdrop-blur-md"
      style={
        reduceMotion
          ? { backgroundColor: "rgba(11, 15, 20, 0.9)" }
          : { backgroundColor: headerBg, boxShadow: headerShadow }
      }
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <motion.a
          href="#"
          className="font-display text-lg font-semibold tracking-tight text-white"
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        >
          {site.name}
          <span className="text-accent">.</span>
        </motion.a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const id = navMap[link.href];
            const isActive = active === id;
            return (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-sm text-zinc-400 transition-colors hover:text-white"
              >
                <span className={isActive ? "text-white" : ""}>{link.label}</span>
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-accent"
                  initial={false}
                  animate={{ width: isActive ? "100%" : "0%" }}
                  transition={{ duration: 0.25 }}
                />
              </a>
            );
          })}
          <motion.a
            href="#contact"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-[#0b0f14]"
            whileHover={reduceMotion ? undefined : { scale: 1.05 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          >
            Hire me
          </motion.a>
        </nav>

        <motion.button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-zinc-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {open ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="overflow-hidden border-t border-white/5 md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col gap-4 px-6 py-4">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="block text-zinc-300"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <a
                  href="#contact"
                  className="inline-block rounded-full bg-accent px-4 py-2 text-sm font-medium text-[#0b0f14]"
                  onClick={() => setOpen(false)}
                >
                  Hire me
                </a>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
