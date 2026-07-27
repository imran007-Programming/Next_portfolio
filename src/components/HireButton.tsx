"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSectionNavigation } from "@/context/SectionNavigation";

export function HireButton() {
  const reduceMotion = useReducedMotion();
  const { navigateTo } = useSectionNavigation();

  return (
    <motion.div
      className="absolute bottom-10 left-8 z-10 hidden md:block"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative h-30 w-30">

        {/* Rotating text ring */}
        <div
          className="absolute inset-0"
          style={reduceMotion ? undefined : { animation: "spin-slow 10s linear infinite" }}
          aria-hidden
        >
          <svg viewBox="0 0 120 120" className="h-full w-full">
            <defs>
              <path
                id="hire-circle"
                d="M 60 60 m -46 0 a 46 46 0 1 1 92 0 a 46 46 0 1 1 -92 0"
              />
            </defs>
            <text
              fontSize="10.5"
              fontWeight="600"
              letterSpacing="3.2"
              fill="rgba(45,212,191,0.85)"
              fontFamily="inherit"
            >
              <textPath href="#hire-circle">
                HIRE ME • HIRE ME • HIRE ME • HIRE ME •&nbsp;
              </textPath>
            </text>
          </svg>
        </div>

        {/* Center button */}
        <button
          type="button"
          onClick={() => navigateTo("contact")}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-15.5 w-15.5 overflow-hidden rounded-full cursor-pointer"
          style={{
            background: "#ffffff",
            boxShadow: "0 4px 24px rgba(255,255,255,0.2)",
          }}
        >
          {/* Wave A — front layer, top visible at ~24px from button top (61% fill) */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: "220px",
              height: "80px",
              bottom: "-42px",
              left: "calc(50% - 110px)",
              borderRadius: "42% 58% 55% 45% / 50% 45% 55% 50%",
              backgroundColor: "var(--accent)",
              opacity: 0.85,
              animation: reduceMotion ? undefined : "water-a 3.5s ease-in-out infinite",
            }}
          />

          {/* Wave B — mid layer */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: "230px",
              height: "85px",
              bottom: "-48px",
              left: "calc(50% - 115px)",
              borderRadius: "55% 45% 48% 52% / 48% 55% 45% 52%",
              backgroundColor: "var(--accent)",
              opacity: 0.55,
              animation: reduceMotion ? undefined : "water-b 5s ease-in-out infinite",
            }}
          />

          {/* Wave C — deep undertone */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: "215px",
              height: "78px",
              bottom: "-38px",
              left: "calc(50% - 107.5px)",
              borderRadius: "48% 52% 42% 58% / 52% 48% 58% 42%",
              backgroundColor: "var(--accent)",
              opacity: 0.3,
              animation: reduceMotion ? undefined : "water-c 7s ease-in-out infinite",
            }}
          />

          {/* Label */}
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
              color: "#0b0f14",
              zIndex: 10,
            }}
          >
            Hire
          </span>
        </button>

      </div>
    </motion.div>
  );
}
