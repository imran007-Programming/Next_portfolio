"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site, navLinks } from "@/data/site";
import { CommandPalette } from "@/components/CommandPalette";

export function Header() {
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
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <motion.div
        className="relative flex w-full max-w-230 items-center justify-between rounded-xl border-[3px] border-ink bg-surface px-3"
        animate={{
          height: scrolled ? 56 : 64,
          boxShadow: scrolled ? "6px 6px 0 0 #0a0a0a" : "4px 4px 0 0 #0a0a0a",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {/* Logo */}
        <button
          className="flex shrink-0 items-center gap-2 font-display text-lg uppercase"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-ink bg-accent text-sm shadow-[2px_2px_0_0_#0a0a0a]">
            {site.name.charAt(0)}
          </span>
          <span>{site.name}</span>
        </button>

        {/* Desktop nav */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`rounded-lg border-2 px-3.5 py-1.5 text-sm font-bold transition-all duration-150 ${
                  isActive
                    ? "border-ink bg-accent shadow-[2px_2px_0_0_#0a0a0a]"
                    : "border-transparent hover:border-ink hover:bg-accent hover:shadow-[2px_2px_0_0_#0a0a0a]"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2">
          <CommandPalette />

          <button
            onClick={() => scrollTo("#contact")}
            className="nb-btn hidden bg-ink px-4 py-1.5 text-xs uppercase tracking-wider text-white md:inline-flex"
          >
            Hire Me
          </button>

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.25 rounded-lg border-2 border-ink bg-accent md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <motion.span className="block h-[2.5px] w-5 bg-ink"
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7.5 : 0 }} transition={{ duration: 0.2 }} />
            <motion.span className="block h-[2.5px] w-5 bg-ink"
              animate={{ opacity: mobileOpen ? 0 : 1 }} transition={{ duration: 0.15 }} />
            <motion.span className="block h-[2.5px] w-5 bg-ink"
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7.5 : 0 }} transition={{ duration: 0.2 }} />
          </button>
        </div>
      </motion.div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nb-card absolute left-4 right-4 top-19.5 overflow-hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-2 p-3">
              {navLinks.map((link, i) => {
                const id = link.href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className={`flex items-center justify-between rounded-lg border-2 border-ink px-4 py-3 text-sm font-bold ${
                      isActive ? "bg-accent" : "bg-surface"
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-xs">0{i + 1}</span>
                  </button>
                );
              })}
              <button
                onClick={() => scrollTo("#contact")}
                className="nb-btn mt-1 bg-ink py-3 text-sm uppercase tracking-wider text-white"
              >
                Hire Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
