"use client";

import { useEffect, useState, useRef, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface TransitionContextType {
  triggerTransition: (sectionId: string, sectionName?: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  triggerTransition: () => {},
});

export const useSectionTransition = () => useContext(TransitionContext);

const SECTION_MAP: Record<string, string> = {
  hero: "HERO",
  about: "ABOUT",
  skills: "TECH STACK",
  projects: "MY WORK",
  contact: "CONTACT",
  faq: "FAQ",
};

export function SectionTransitionProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentSectionRef = useRef<string>("hero");
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const lastTriggerTimeRef = useRef<number>(0);

  const triggerTransition = (sectionId: string, sectionName?: string) => {
    if (isAnimating) return;

    const cleanId = sectionId.replace("#", "").toLowerCase();
    const displayName = sectionName || SECTION_MAP[cleanId] || cleanId.toUpperCase();

    currentSectionRef.current = cleanId;
    isProgrammaticScrollRef.current = true;

    setActiveSection(displayName);
    setIsAnimating(true);

    // Scroll target element after curtain drops
    setTimeout(() => {
      const targetEl = document.getElementById(cleanId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      } else if (cleanId === "top" || cleanId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 200);

    // Reset programmatic flag & animation state
    setTimeout(() => {
      setIsAnimating(false);
      setActiveSection(null);
      isProgrammaticScrollRef.current = false;
    }, 600);
  };

  // 1. Intercept all internal anchor link clicks across the site
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") || target?.closest("button");
      if (!anchor) return;

      let href = anchor.getAttribute("href") || anchor.getAttribute("data-scroll-to");

      if (!href && anchor.tagName === "BUTTON") {
        const text = anchor.textContent?.trim().toLowerCase();
        if (text && ["about", "skills", "projects", "contact", "work"].includes(text)) {
          href = `#${text === "work" ? "projects" : text}`;
        }
      }

      if (href && (href.startsWith("#") || href.startsWith("/#"))) {
        const cleanId = href.split("#")[1];
        if (cleanId) {
          e.preventDefault();
          triggerTransition(cleanId, SECTION_MAP[cleanId] || cleanId.toUpperCase());
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, [isAnimating]);

  // 2. IntersectionObserver: Trigger overlay when user SCROLLS into a new section
  useEffect(() => {
    if (reduceMotion) return;

    const sections = Object.keys(SECTION_MAP)
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return;

         entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const now = Date.now();
            if (
              currentSectionRef.current !== sectionId &&
              !isAnimating &&
              now - lastTriggerTimeRef.current > 1500
            ) {
              lastTriggerTimeRef.current = now;
              currentSectionRef.current = sectionId;
              const name = SECTION_MAP[sectionId] || sectionId.toUpperCase();
              
              setActiveSection(name);
              setIsAnimating(true);

              setTimeout(() => {
                setIsAnimating(false);
                setActiveSection(null);
              }, 550);
            }
          }
        });
      },
      {
        threshold: 0.4, // Trigger when 40% of the new section is in view
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, [isAnimating, reduceMotion]);

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {children}

      {/* ── Fullscreen Section Transition Overlay ── */}
      <AnimatePresence>
        {isAnimating && !reduceMotion && (
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden bg-[#07070a]/90 backdrop-blur-3xl"
            initial={{ scaleY: 0, transformOrigin: "top" }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, transformOrigin: "bottom" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ambient Purple Radial Glow in overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.25),transparent_65%)]" />

            {/* Glowing Light Beam Sweeping across overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/25 to-transparent skew-x-[-25deg]"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
            />

            {/* Section Name Indicator */}
            {activeSection && (
              <motion.div
                className="relative z-10 flex flex-col items-center gap-2 text-center px-4"
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.22 }}
              >
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-purple-400">
                  Entering Section
                </span>
                <h3 className="text-3xl font-extrabold uppercase tracking-[0.2em] text-white sm:text-5xl drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]">
                  {activeSection}
                </h3>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
