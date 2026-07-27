"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { About } from "@/components/About";
import { ChatBot } from "@/components/ChatBot";
import { Contact } from "@/components/Contact";
import { CursorGlow } from "@/components/CursorGlow";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { NavPill } from "@/components/NavPill";
import { Projects } from "@/components/Projects";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SectionFrame } from "@/components/SectionFrame";
import { Skills } from "@/components/Skills";
import { useSectionNavigation } from "@/context/SectionNavigation";
import type { SectionId } from "@/lib/sections";

function SectionPanel({ section }: { section: SectionId }) {
  switch (section) {
    case "hero":
      return (
        <SectionFrame id="hero" className="overflow-hidden">
          <Hero />
        </SectionFrame>
      );
    case "about":
      return (
        <SectionFrame id="about">
          <About />
        </SectionFrame>
      );
    case "skills":
      return (
        <SectionFrame id="skills">
          <Skills />
        </SectionFrame>
      );
    case "projects":
      return (
        <SectionFrame id="projects">
          <Projects />
        </SectionFrame>
      );
    case "contact":
      return (
        <SectionFrame id="contact">
          <Contact />
          <Footer />
        </SectionFrame>
      );
    default:
      return null;
  }
}

export function FullPageShell() {
  const { section, shutterPhase } = useSectionNavigation();
  const reduceMotion = useReducedMotion();
  const isTransitioning = shutterPhase !== "idle";

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <NavPill />
      <div className="relative h-dvh overflow-hidden bg-background">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={section}
            className="absolute inset-0"
            initial={
              reduceMotion || isTransitioning ? false : { opacity: 0 }
            }
            animate={{ opacity: 1 }}
            exit={
              reduceMotion || isTransitioning ? undefined : { opacity: 0 }
            }
            transition={{ duration: isTransitioning ? 0 : 0.2 }}
          >
            <SectionPanel section={section} />
          </motion.div>
        </AnimatePresence>
      </div>
      <ChatBot />
    </>
  );
}
