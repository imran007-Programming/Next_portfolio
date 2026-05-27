"use client";

import { FadeIn } from "@/components/motion/FadeIn";
import { site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <FadeIn direction="none">
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            Built with{" "}
            <span className="text-zinc-400">Next.js</span> &{" "}
            <span className="text-zinc-400">Tailwind CSS</span>
          </p>
        </div>
      </footer>
    </FadeIn>
  );
}
