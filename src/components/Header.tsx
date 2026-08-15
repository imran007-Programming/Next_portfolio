"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site, navLinks } from "@/data/site";
import { CommandPalette } from "@/components/CommandPalette";
import { ColorPicker } from "@/components/ColorPicker";

export function Header() {
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 80);

        const sections = ["hero", "about", "skills", "projects", "contact"];
        for (const id of [...sections].reverse()) {
          const el = document.getElementById(id);
          if (el && y >= el.offsetTop - 120) {
            setActiveSection(id);
            break;
          }
        }

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
      <div className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">
        <motion.div
          className="flex items-center justify-between rounded-full px-4 border"
          animate={{
            width: scrolled ? "860px" : "900px",
            height: scrolled ? "48px" : "56px",
            background: scrolled
              ? "rgba(10,10,10,0.95)"
              : "rgba(10,10,10,0.6)",
            borderColor: scrolled
              ? "rgba(255,255,255,0.12)"
              : "rgba(255,255,255,0.07)",
            boxShadow: scrolled
              ? "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0 2px 12px rgba(0,0,0,0.2)",
          }}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            maxWidth: "100%",
          }}
          transition={{
            width: { type: "spring", stiffness: 200, damping: 30 },
            height: { type: "spring", stiffness: 200, damping: 30 },
            background: { duration: 0.4 },
            boxShadow: { duration: 0.4 },
            borderColor: { duration: 0.4 },
          }}
        >
          {/* Logo */}
          <motion.button
            className="shrink-0 font-bold tracking-tight"
            style={{ color: "var(--foreground)", background: "none", border: "none" }}
            animate={{ fontSize: scrolled ? "13px" : "14px" }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ opacity: 0.8 }}
            whileTap={{ scale: 0.95 }}
          >
            {site.name}
            <span style={{ color: "var(--accent)" }}>.</span>
          </motion.button>

          {/* Desktop nav */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200"
                  style={{
                    color: isActive ? "var(--foreground)" : "var(--muted)",
                    background: "none",
                    border: "none",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="pill-active"
                      className="absolute inset-0 rounded-full"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-2">
            <ColorPicker />
            <CommandPalette />

            <motion.button
              onClick={() => scrollTo("#contact")}
              className="group relative hidden overflow-hidden rounded-full text-xs font-bold uppercase tracking-wider md:block"
              style={{ background: "var(--accent)", color: "#080808", border: "none" }}
              animate={{ paddingLeft: scrolled ? "14px" : "18px", paddingRight: scrolled ? "14px" : "18px", paddingTop: "7px", paddingBottom: "7px" }}
              transition={{ duration: 0.3 }}
              whileHover={reduceMotion ? undefined : { scale: 1.05, y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            >
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
              <motion.span className="block h-[1.5px] w-5 rounded-full" style={{ background: "var(--foreground)" }}
                animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6.5 : 0 }} transition={{ duration: 0.25 }} />
              <motion.span className="block h-[1.5px] w-5 rounded-full" style={{ background: "var(--foreground)" }}
                animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }} transition={{ duration: 0.2 }} />
              <motion.span className="block h-[1.5px] w-5 rounded-full" style={{ background: "var(--foreground)" }}
                animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6.5 : 0 }} transition={{ duration: 0.25 }} />
            </button>
          </div>
        </motion.div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="absolute top-[70px] left-4 right-4 overflow-hidden rounded-2xl"
              style={{
                background: "rgba(10,10,10,0.97)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
              }}
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col gap-1 p-3">
                {navLinks.map((link, i) => {
                  const id = link.href.replace("#", "");
                  const isActive = activeSection === id;
                  return (
                    <motion.button
                      key={link.href}
                      onClick={() => scrollTo(link.href)}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold"
                      style={{
                        color: isActive ? "var(--accent)" : "var(--foreground)",
                        background: isActive ? "var(--accent-dim)" : "transparent",
                        border: "none",
                      }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                    >
                      <span>{link.label}</span>
                      <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>0{i + 1}</span>
                    </motion.button>
                  );
                })}
                <motion.button
                  onClick={() => scrollTo("#contact")}
                  className="mt-1 rounded-xl py-3 text-center text-sm font-bold uppercase tracking-wider"
                  style={{ background: "var(--accent)", color: "#080808", border: "none" }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + navLinks.length * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Hire Me
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
