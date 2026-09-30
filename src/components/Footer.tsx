"use client";

import { site } from "@/data/site";

const linkClass =
  "w-fit text-xl font-bold tracking-tight text-white decoration-[3px] underline-offset-4 transition-colors hover:text-accent hover:underline sm:text-2xl";

export function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t-[3px] border-ink bg-ink pb-6 pt-16 text-white md:pt-24">
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        {/* ── Columns grid ── */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 md:gap-16">
          {/* Contact column */}
          <div>
            <p className="nb-tag mb-5 bg-accent px-2.5 py-1 font-mono text-xs uppercase tracking-widest shadow-[3px_3px_0_0_#fff]">
              Contact
            </p>
            <div className="flex flex-col gap-2">
              <a href={`mailto:${site.email}`} className={`${linkClass} break-all`}>
                {site.email}
              </a>
              <p className="text-lg font-semibold text-white/80 sm:text-xl">
                {site.location}
              </p>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 w-fit text-sm font-medium text-white/70 transition-colors hover:text-accent"
              >
                {site.phone}
              </a>
            </div>
          </div>

          {/* Social column */}
          <div>
            <p className="nb-tag mb-5 bg-nb-pink px-2.5 py-1 font-mono text-xs uppercase tracking-widest shadow-[3px_3px_0_0_#fff]">
              Social
            </p>
            <div className="flex flex-col gap-2">
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                LinkedIn ↗
              </a>
              <a href={site.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                GitHub ↗
              </a>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <p className="nb-tag mb-5 bg-nb-blue px-2.5 py-1 font-mono text-xs uppercase tracking-widest shadow-[3px_3px_0_0_#fff]">
              Navigation
            </p>
            <div className="flex flex-col gap-2">
              {["about", "skills", "projects", "contact"].map((id) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`${linkClass} text-left capitalize`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sub-bar: Copyright & Back to top ── */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t-[3px] border-white/20 pt-8">
          <p className="text-xs font-semibold text-white/70">
            © {year} {site.name}. All rights reserved.
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-lg border-2 border-white bg-accent px-3 py-1.5 text-xs font-bold uppercase text-ink shadow-[3px_3px_0_0_#fff] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#fff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            Back to top ↑
          </button>
        </div>

        {/* ── Giant branding text ── */}
        <div className="pointer-events-none mt-12 select-none overflow-hidden px-2 text-center">
          <h2
            className="font-display text-[clamp(4rem,19vw,17rem)] uppercase leading-[0.9] text-accent"
            style={{ textShadow: "6px 6px 0 #ffffff" }}
          >
            Imran
          </h2>
        </div>
      </div>
    </footer>
  );
}
