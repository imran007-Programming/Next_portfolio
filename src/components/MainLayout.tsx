"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgressLinear";
import { ChatBot } from "@/components/ChatBot";
import { SectionTransitionProvider } from "@/components/SectionTransitionOverlay";

export function MainLayout() {
  return (
    <SectionTransitionProvider>
      {/* Global effects */}
      <SmoothScroll />
      <ScrollProgress />

      {/* Floating pill navbar */}
      <Header />

      {/* Main page content */}
      <div>
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>

      {/* Floating overlays */}
      <ChatBot />
    </SectionTransitionProvider>
  );
}
