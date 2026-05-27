"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { PageShutter } from "@/components/motion/PageShutter";
import {
  hashToSection,
  sectionIndex,
  sectionToHash,
  SECTION_IDS,
  type SectionId,
} from "@/lib/sections";

export type ShutterPhase = "idle" | "closing" | "opening";

type SectionNavigationContextValue = {
  section: SectionId;
  shutterPhase: ShutterPhase;
  navigateTo: (target: SectionId) => void;
};

const SectionNavigationContext =
  createContext<SectionNavigationContextValue | null>(null);

export function SectionNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const [section, setSection] = useState<SectionId>("hero");
  const [shutterPhase, setShutterPhase] = useState<ShutterPhase>("idle");
  const pendingRef = useRef<SectionId | null>(null);
  const sectionRef = useRef(section);
  const shutterRef = useRef(shutterPhase);
  sectionRef.current = section;
  shutterRef.current = shutterPhase;

  const applyHash = useCallback((id: SectionId) => {
    const hash = sectionToHash(id);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${hash}`
    );
  }, []);

  const finishClose = useCallback(() => {
    const target = pendingRef.current;
    if (target) {
      setSection(target);
      applyHash(target);
      pendingRef.current = null;
    }
    setShutterPhase("opening");
  }, [applyHash]);

  const finishOpen = useCallback(() => {
    setShutterPhase("idle");
  }, []);

  const navigateTo = useCallback(
    (target: SectionId) => {
      if (target === sectionRef.current) return;
      if (shutterRef.current !== "idle" && !reduceMotion) return;

      if (reduceMotion) {
        setSection(target);
        applyHash(target);
        return;
      }

      pendingRef.current = target;
      setShutterPhase("closing");
    },
    [applyHash, reduceMotion]
  );

  useEffect(() => {
    const fromHash = () => {
      const next = hashToSection(window.location.hash);
      if (!next || next === sectionRef.current) return;
      if (reduceMotion) {
        setSection(next);
        return;
      }
      if (shutterRef.current !== "idle") return;
      pendingRef.current = next;
      setShutterPhase("closing");
    };

    const initial = hashToSection(window.location.hash);
    if (initial && initial !== "hero") {
      setSection(initial);
    }

    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [reduceMotion]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (shutterRef.current !== "idle") return;
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }

      const idx = sectionIndex(sectionRef.current);
      let next: SectionId | null = null;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (idx < SECTION_IDS.length - 1) next = SECTION_IDS[idx + 1];
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (idx > 0) next = SECTION_IDS[idx - 1];
      } else if (e.key === "Home") {
        next = "hero";
      } else if (e.key === "End") {
        next = "contact";
      }

      if (next) {
        e.preventDefault();
        navigateTo(next);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigateTo]);

  return (
    <SectionNavigationContext.Provider
      value={{ section, shutterPhase, navigateTo }}
    >
      {children}
      <PageShutter
        phase={shutterPhase}
        onCloseComplete={finishClose}
        onOpenComplete={finishOpen}
      />
    </SectionNavigationContext.Provider>
  );
}

export function useSectionNavigation() {
  const ctx = useContext(SectionNavigationContext);
  if (!ctx) {
    throw new Error(
      "useSectionNavigation must be used within SectionNavigationProvider"
    );
  }
  return ctx;
}

export function useSectionNavigationOptional() {
  return useContext(SectionNavigationContext);
}
