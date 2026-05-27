"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { typewriterLines } from "@/data/site";

export function TypewriterGradient() {
  const reduceMotion = useReducedMotion();
  const [text, setText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setText(typewriterLines[0]);
      return;
    }

    const current = typewriterLines[lineIndex];
    let delay = isDeleting ? 45 : 85;

    if (!isDeleting && text === current) {
      delay = 2200;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting && text === current) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
        setLineIndex((i) => (i + 1) % typewriterLines.length);
        return;
      }

      setText(
        isDeleting
          ? current.slice(0, text.length - 1)
          : current.slice(0, text.length + 1)
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, lineIndex, reduceMotion]);

  return (
    <span className="inline-block min-h-[1.25em]">
      <span className="bg-gradient-to-r from-accent via-cyan-300 to-violet-400 bg-clip-text text-transparent">
        {text}
      </span>
      <span
        className="ml-0.5 inline-block w-[3px] animate-pulse bg-accent align-middle"
        style={{ height: "0.9em" }}
        aria-hidden
      />
    </span>
  );
}
