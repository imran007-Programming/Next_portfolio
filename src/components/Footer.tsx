"use client";

import { FadeIn } from "@/components/motion/FadeIn";
import { site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <FadeIn direction="none">
      <footer className="border-t border-black/5 py-8 dark:border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            Built with{" "}
            <span className="text-foreground/70">Next.js</span> &{" "}
            <span className="text-foreground/70">Tailwind CSS</span>
          </p>
        </div>
      </footer>
    </FadeIn>
  );
}
