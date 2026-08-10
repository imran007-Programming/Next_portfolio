"use client";

import { site } from "@/data/site";
import { FramerBlurLetters } from "@/components/TextReveal";
import { motion } from "framer-motion";

export function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="relative overflow-hidden border-t pt-16 pb-6 md:pt-24 backdrop-blur-2xl bg-gradient-to-b from-transparent via-purple-950/20 to-black/90"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Full footer glass ambient gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.14),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        {/* ── Columns grid (iboxlab style) ── */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 md:gap-16">
          {/* Contact column */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Contact
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${site.email}`}
                className="text-xl font-bold tracking-tight text-foreground transition-colors hover:text-accent sm:text-2xl"
              >
                {site.email}
              </a>
              <p className="text-lg font-semibold text-foreground/90 sm:text-xl">
                {site.location}
              </p>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-foreground transition-colors mt-1"
              >
                {site.phone}
              </a>
            </div>
          </div>

          {/* Social column */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Social
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold tracking-tight text-foreground transition-colors hover:text-accent sm:text-2xl"
              >
                LinkedIn
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold tracking-tight text-foreground transition-colors hover:text-accent sm:text-2xl"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Navigation
            </p>
            <div className="flex flex-col gap-2">
              {["about", "skills", "projects", "contact"].map((id) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-left text-xl font-bold capitalize tracking-tight text-foreground transition-colors hover:text-accent sm:text-2xl"
                  style={{ background: "none", border: "none" }}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sub-bar: Copyright & Back to top ── */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs text-muted">
            © {year} {site.name}. All rights reserved.
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs font-semibold text-accent transition-opacity hover:opacity-80"
            style={{ background: "none", border: "none" }}
          >
            Back to top
          </button>
        </div>

        {/* ── GIANT Branding Text (Clean iBoxLab Style) ── */}
        <div className="mt-12 overflow-hidden select-none pointer-events-none text-center px-4">
          <h2
            className="text-[clamp(3.8rem,16vw,14rem)] font-black uppercase leading-none tracking-[0.15em] select-none"
            style={{ fontFamily: 'var(--font-unbounded)' }}
          >
            <FramerBlurLetters 
              text="Imran" 
              delay={0.15} 
              className="bg-gradient-to-b from-white via-zinc-400 to-zinc-800 bg-clip-text text-transparent"
            />
          </h2>
        </div>
      </div>
    </footer>
  );
}
