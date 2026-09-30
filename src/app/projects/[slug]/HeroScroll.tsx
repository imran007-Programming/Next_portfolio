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
    <div className="relative overflow-hidden bg-surface">
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

      {/* scroll indicator */}
      <div className="nb-tag absolute bottom-4 left-1/2 -translate-x-1/2 bg-accent px-3 py-1 text-[11px]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Full page preview
      </div>
    </div>
  );
}
