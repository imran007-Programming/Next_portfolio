"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site, navLinks } from "@/data/site";
import { CommandPalette } from "@/components/CommandPalette";

export function Header() {
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);   // hide on scroll-down
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  /* ── Track scroll: bg opacity + section highlight + hide/show ── */
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY.current;

        /* Only trigger hide/show after passing hero area */
        if (y > 120) {
          if (delta > 6)  setHidden(true);   // scrolling DOWN  → hide
          if (delta < -6) setHidden(false);  // scrolling UP   → show
        } else {
          setHidden(false); // always show at top
        }

        setScrolled(y > 60);

        /* Active section highlight */
        const sections = ["hero", "about", "skills", "projects", "contact"];
        for (const id of [...sections].reverse()) {
          const el = document.getElementById(id);
          if (el && y >= el.offsetTop - 120) {
            setActiveSection(id);
            break;
          }
        }

        lastScrollY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-6 z-50 px-4 sm:px-6 md:px-10"
        /* sits BELOW the marquee banner (which is ~32px tall) */
        animate={{
          y: hidden ? -90 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{
          y:       { type: "spring", stiffness: 260, damping: 28 },
          opacity: { duration: 0.25, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="mx-auto flex h-14 w-full items-center justify-between rounded-lg px-5"
          animate={{
            maxWidth: scrolled ? "52rem" : "64rem",
            background: scrolled
              ? "rgba(12,12,12,0.88)"
              : "rgba(12,12,12,0.55)",
            borderColor: scrolled
              ? "rgba(255,255,255,0.12)"
              : "rgba(255,255,255,0.06)",
            boxShadow: scrolled
              ? "0 8px 32px rgba(0,0,0,0.4), 0 0 16px rgba(139,92,246,0.15)"
              : "none",
            backdropFilter: "blur(20px)",
          }}
          style={{
            border: "1px solid rgba(255,255,255,0.06)",
            WebkitBackdropFilter: "blur(20px)",
          }}
          transition={{
            maxWidth: { type: "spring", stiffness: 220, damping: 26 },
            duration: 0.3,
          }}
        >
          {/* Logo */}
          <button
            className="text-sm font-bold tracking-tight transition-colors duration-200 hover:text-accent"
            style={{ color: "var(--foreground)", background: "none", border: "none" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {site.name}
            <span style={{ color: "var(--accent)" }}>.</span>
          </button>

          {/* Desktop nav — centered pill links */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="relative rounded-lg px-4 py-1.5 text-sm transition-colors duration-200"
                  style={{
                    color: isActive ? "var(--foreground)" : "var(--muted)",
                    background: "none",
                    border: "none",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                      transition={{ type: "spring", stiffness: 350, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            <CommandPalette />

            <motion.button
              onClick={() => scrollTo("#contact")}
              className="group relative overflow-hidden hidden rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-wider md:block shadow-md"
              style={{
                background: "var(--accent)",
                color: "#080808",
              }}
              whileHover={reduceMotion ? undefined : { scale: 1.06, y: -1, boxShadow: "0 0 20px rgba(139,92,246,0.6)" }}
              whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            >
              {/* Sheen beam */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <span className="relative z-10">Hire Me</span>
            </motion.button>

            {/* Mobile hamburger */}
            <button
              className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              style={{ background: "none", border: "none" }}
            >
              <motion.span
                className="block h-[1.5px] w-5 rounded-lg"
                style={{ background: "var(--foreground)" }}
                animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6.5 : 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="block h-[1.5px] w-5 rounded-lg"
                style={{ background: "var(--foreground)" }}
                animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-[1.5px] w-5 rounded-lg"
                style={{ background: "var(--foreground)" }}
                animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6.5 : 0 }}
                transition={{ duration: 0.25 }}
              />
            </button>
          </div>
        </motion.div>

        {/* Mobile dropdown — Shutter roll-down effect */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-2xl"
              style={{
                background: "rgba(12,12,12,0.96)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(139,92,246,0.15)",
              }}
              initial={{ height: 0, opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              animate={{ height: "auto", opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              exit={{ height: 0, opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col gap-1.5 p-4">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-left text-base font-semibold transition-colors duration-200 hover:bg-white/10 hover:text-white"
                    style={{ color: "var(--foreground)", background: "none", border: "none" }}
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.12 + i * 0.06 }}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs text-muted font-mono">0{i + 1}</span>
                  </motion.button>
                ))}
                <motion.button
                  onClick={() => scrollTo("#contact")}
                  className="mt-2 rounded-xl py-3.5 text-center text-sm font-bold uppercase tracking-wider transition-all duration-300 active:scale-98"
                  style={{ background: "var(--accent)", color: "#080808", border: "none" }}
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.12 + navLinks.length * 0.06 }}
                >
                  Hire Me
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
