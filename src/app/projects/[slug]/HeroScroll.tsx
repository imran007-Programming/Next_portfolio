"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";

export function HeroScroll({ src, alt }: { src: string; alt: string }) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLImageElement>(null);
  const controls   = useAnimation();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const img  = imgRef.current;
    const wrap = wrapRef.current;
    if (!img || !wrap) return;

    let timer: ReturnType<typeof setTimeout>;

    const run = () => {
      const dist = img.offsetHeight - wrap.clientHeight;
      if (dist <= 0 || reducedMotion) return;
      timer = setTimeout(() => {
        controls.start({
          y: -dist,
          transition: { duration: dist / 120, ease: "linear" },
        });
      }, 1200);
    };

    if (img.complete) {
      run();
    } else {
      img.addEventListener("load", run, { once: true });
    }

    return () => {
      clearTimeout(timer);
      img.removeEventListener("load", run);
    };
  }, [controls, reducedMotion]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/8 bg-surface dark:border-white/8">
      <div ref={wrapRef} className="h-[68vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          ref={imgRef}
          animate={controls}
          src={src}
          alt={alt}
          className="w-full h-auto block"
          style={{ y: 0 }}
        />
      </div>

      {/* bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-surface/80 to-transparent" />

      {/* scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-1.5 text-[11px] font-medium text-white/60 backdrop-blur-sm">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Full page preview
      </div>
    </div>
  );
}
