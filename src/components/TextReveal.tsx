"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

/**
 * Framer-Style Scroll Blur & Spring Word Reveal
 * Words fade in from opacity: 0.15, blur(8px), y: 14px into full crisp opacity: 1
 */
export function FramerBlurWordReveal({ text, className = "", delay = 0 }: WordRevealProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.065,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0.15,
      filter: "blur(8px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className="inline"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={child}
          className={`inline-block mr-[0.25em] transform-gpu will-change-[filter,opacity] ${className}`}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

const SCRAMBLE_CHARS = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&$@";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;
  speed?: number;
}

/**
 * Matrix / Hacker Text Scramble Decrypt Animation
 */
export function TextScramble({ text, className = "", duration = 1.2, speed = 40 }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.floor((duration * 1000) / speed);

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealedLength = Math.floor(text.length * progress);

      const scrambled = text
        .split("")
        .map((char, i) => {
          if (i < revealedLength || char === " ") return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");

      setDisplayText(scrambled);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, duration, speed]);

  return <span className={className}>{displayText}</span>;
}

/**
 * Real 3D Spring Word Flip Reveal (Rotates along X-axis with perspective)
 */
export function Framer3DWordFlip({ text, className = "", delay = 0 }: WordRevealProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      rotateX: -80,
      y: 40,
      transformOrigin: "bottom center",
    },
    visible: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 14,
        stiffness: 90,
      },
    },
  };

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      style={{ perspective: 1000 }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={child}
          className="inline-block transform-gpu mr-[0.25em]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export const MaskedWordReveal = FramerBlurWordReveal;

/**
 * Character-by-character Blur Reveal for Giant Branding Text
 */
export function FramerBlurLetters({ text, className = "", delay = 0 }: WordRevealProps) {
  const reduceMotion = useReducedMotion();
  const letters = Array.from(text);

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0.08,
      filter: "blur(12px)",
      y: 20,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className="inline-flex justify-center"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          className={`inline-block transform-gpu will-change-[filter,opacity] ${className}`}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
