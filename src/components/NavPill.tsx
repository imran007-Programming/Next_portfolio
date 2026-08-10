"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useTheme } from "next-themes";
import { useSectionNavigation } from "@/context/SectionNavigation";
import { useActiveSection, type SectionId } from "@/hooks/useActiveSection";
import { navLinks, site } from "@/data/site";

const navMap: Record<string, SectionId> = {
  "#about": "about",
  "#skills": "skills",
  "#projects": "projects",
  "#contact": "contact",
};

/* ── Animated hamburger ──────────────────────────────────────────── */
function HamburgerIcon({ open }: { open: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const;
  return (
    <div className="flex h-3.5 w-4.5 flex-col justify-between" aria-hidden>
      <motion.span
        className="block h-[1.75px] w-full origin-center rounded-lg bg-current"
        animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease }}
      />
      <motion.span
        className="block h-[1.75px] w-full rounded-lg bg-current"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
        style={{ originX: "50%" }}
      />
      <motion.span
        className="block h-[1.75px] w-full origin-center rounded-lg bg-current"
        animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease }}
      />
    </div>
  );
}

/* ── Desktop nav item ────────────────────────────────────────────── */
function NavItem({
  label, target, isActive, onSelect,
}: {
  label: string; target: SectionId; isActive: boolean; onSelect: (id: SectionId) => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  function onEnter() {
    if (reduceMotion) return;
    const chars = btnRef.current?.querySelectorAll<HTMLElement>(".nc");
    if (!chars?.length) return;
    gsap.killTweensOf(chars);
    gsap.fromTo(
      chars,
      { y: 0 },
      { y: -5, duration: 0.18, stagger: 0.03, ease: "power2.out", yoyo: true, repeat: 1 }
    );
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={() => onSelect(target)}
      onMouseEnter={onEnter}
      className={`relative cursor-pointer overflow-hidden rounded-lg px-3 py-1.5 text-sm transition-colors ${
        isActive ? "bg-black/10 text-foreground dark:bg-white/10" : "text-muted hover:text-foreground"
      }`}
    >
      {label.split("").map((char, i) => (
        <span key={i} className="nc inline-block">{char}</span>
      ))}
    </button>
  );
}

/* ── Theme toggle ────────────────────────────────────────────────── */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    const next = isDark ? "light" : "dark";

    if (!("startViewTransition" in document)) {
      setTheme(next);
      return;
    }

    const rect = btnRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vt = (document as any).startViewTransition(() => {
      setTheme(next);
    });
    vt.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  }

  return (
    <motion.button
      ref={btnRef}
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-muted transition-colors hover:text-foreground"
      whileTap={{ scale: 0.88 }}
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </motion.span>
        </AnimatePresence>
      )}
    </motion.button>
  );
}

/* ── Mobile nav item with letter stagger ────────────────────────── */
function MobileNavItem({
  link, index, isActive, onSelect, slideEase,
}: {
  link: { href: string; label: string };
  index: number;
  isActive: boolean;
  onSelect: (id: SectionId) => void;
  slideEase: readonly number[];
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const id = navMap[link.href];

  function onEnter() {
    if (reduceMotion) return;
    const chars = btnRef.current?.querySelectorAll<HTMLElement>(".mnc");
    if (!chars?.length) return;
    gsap.killTweensOf(chars);
    gsap.fromTo(
      chars,
      { y: 0 },
      { y: -10, duration: 0.2, stagger: 0.025, ease: "power2.out", yoyo: true, repeat: 1 }
    );
  }

  return (
    <motion.button
      ref={btnRef}
      type="button"
      className={`group flex w-full cursor-pointer items-center gap-4 text-4xl font-bold transition-colors sm:text-5xl ${
        isActive ? "text-accent" : "text-foreground/70 hover:text-foreground"
      }`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.06 + 0.12, duration: 0.4, ease: slideEase as number[] as [number, number, number, number] }}
      onClick={() => onSelect(id)}
      onMouseEnter={onEnter}
    >
      <span className="text-sm font-normal tabular-nums text-accent/50">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="overflow-hidden">
        {link.label.split("").map((char, i) => (
          <span key={i} className="mnc inline-block">{char}</span>
        ))}
      </span>
      {isActive && (
        <motion.span layoutId="mob-dot" className="h-2 w-2 rounded-lg bg-accent" />
      )}
    </motion.button>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
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

  const slideEase = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      {/* ── Full-page mobile menu (behind nav pill at z-[49]) ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-49 flex flex-col overflow-hidden bg-background md:hidden"
            initial={{ opacity: 0, y: "-6%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-6%" }}
            transition={{ duration: reduceMotion ? 0.15 : 0.35, ease: slideEase }}
          >
            {/* Accent glow */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute left-1/2 top-1/3 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-accent/10 blur-[80px]" />
            </div>

            {/* Nav links */}
            <nav className="relative flex flex-1 flex-col items-start justify-center gap-5 px-10 pt-20">
              {navLinks.map((link, i) => {
                const id = navMap[link.href];
                const isActive = active === id;
                return (
                  <MobileNavItem
                    key={link.href}
                    link={link}
                    index={i}
                    isActive={isActive}
                    onSelect={goTo}
                    slideEase={slideEase}
                  />
                );
              })}

              <motion.button
                type="button"
                className="mt-6 cursor-pointer rounded-lg bg-accent px-10 py-3.5 text-base font-bold text-[#0b0f14] shadow-[0_0_40px_rgba(45,212,191,0.25)] transition-shadow hover:shadow-[0_0_48px_rgba(45,212,191,0.4)]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: navLinks.length * 0.06 + 0.12, duration: 0.4, ease: slideEase }}
                onClick={() => goTo("contact")}
              >
                Hire me ↗
              </motion.button>
            </nav>

            {/* Bottom bar */}
            <motion.div
              className="relative flex items-center justify-center pb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nav pill ── */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div className="pointer-events-auto">
          <motion.nav
            layout
            aria-label="Main navigation"
            className="flex items-center gap-1 rounded-lg border border-black/10 bg-white/85 px-3 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0b0f14]/85 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:px-4 sm:py-2"
            initial={false}
            animate={{ borderColor: "rgba(45, 212, 191, 0.2)" }}
          >
            {/* Logo */}
            <motion.button
              type="button"
              layout="position"
              className="font-display shrink-0 cursor-pointer px-2 py-1.5 text-sm font-semibold tracking-tight text-foreground sm:text-base"
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              onClick={() => goTo("hero")}
            >
              {site.name}<span className="text-accent">.</span>
            </motion.button>

            <div className="mx-0.5 hidden h-5 w-px bg-black/10 dark:bg-white/10 sm:block" aria-hidden />

            {/* Desktop nav links */}
            <ul className="hidden items-center gap-0.5 md:flex">
              {navLinks.map((link) => {
                const id = navMap[link.href];
                return (
                  <li key={link.href}>
                    <NavItem label={link.label} target={id} isActive={active === id} onSelect={goTo} />
                  </li>
                );
              })}
            </ul>

            {/* Desktop: Hire me */}
            <motion.button
              type="button"
              className="ml-1 hidden shrink-0 cursor-pointer rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-[#0b0f14] md:inline-flex"
              whileHover={reduceMotion ? undefined : { scale: 1.05 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              onClick={() => goTo("contact")}
            >
              Hire me
            </motion.button>

            {/* Mobile: hamburger */}
            <motion.button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="ml-0.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-black/10 text-muted dark:border-white/10 md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            >
              <HamburgerIcon open={menuOpen} />
            </motion.button>

            {/* Theme toggle — rightmost on all sizes */}
            <ThemeToggle />
          </motion.nav>
        </div>
      </div>
    </>
  );
}
