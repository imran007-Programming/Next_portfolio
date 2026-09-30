"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface TerminalProps {
  commands: string[];
  outputs?: Record<number, string[]>;
  typingSpeed?: number;
  delayBetweenCommands?: number;
  className?: string;
  soundEnabled?: boolean;
}

export function Terminal({
  commands,
  outputs = {},
  typingSpeed = 45,
  delayBetweenCommands = 1000,
  className = "",
  soundEnabled: initialSound = true,
}: TerminalProps) {
  const reduceMotion = useReducedMotion();
  const [commandIndex, setCommandIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [currentOutputLine, setCurrentOutputLine] = useState(0);
  const [currentOutputChar, setCurrentOutputChar] = useState(0);
  const [isTypingCommand, setIsTypingCommand] = useState(false);
  const [isTypingOutput, setIsTypingOutput] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(initialSound);
  const [copied, setCopied] = useState(false);

  // Completed history of items: { type: 'cmd' | 'output', text: string }
  const [history, setHistory] = useState<
    { type: "cmd" | "output"; text: string; cmdIdx?: number }[]
  >([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // IntersectionObserver: start typing when terminal enters viewport (once)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTypingCommand(prev => {
            // Only trigger once: if not already typing and not finished
            if (!prev) return true;
            return prev;
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sync sound.ogg playback with typing state
  const isActivelyTyping =
    !isFinished &&
    ((isTypingCommand && charIndex < (commands[commandIndex]?.length ?? 0)) ||
      (isTypingOutput &&
        currentOutputChar <
          ((outputs[commandIndex] ?? [])[currentOutputLine]?.length ?? 0)));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (soundEnabled && isActivelyTyping) {
      audio.playbackRate = 5.0;
      audio.volume = 1.0;
      audio.play().catch(() => {
        // Autoplay blocked — user must click terminal first
      });
    } else {
      audio.pause();
    }
  }, [soundEnabled, isActivelyTyping]);

  const currentCmdText = commands[commandIndex] ?? "";
  const currentCmdOutputs = outputs[commandIndex] ?? [];

  // Main typing state machine
  useEffect(() => {
    if (isFinished) return;

    if (reduceMotion) {
      const fullHistory: { type: "cmd" | "output"; text: string }[] = [];
      commands.forEach((cmd, idx) => {
        fullHistory.push({ type: "cmd", text: cmd });
        if (outputs[idx]) {
          outputs[idx].forEach((out) => fullHistory.push({ type: "output", text: out }));
        }
      });
      setHistory(fullHistory);
      setIsFinished(true);
      return;
    }

    if (commandIndex >= commands.length) {
      // All commands done — stop (no replay)
      setIsFinished(true);
      return;
    }

    // Step A: Typing the Command character by character
    if (isTypingCommand) {
      if (charIndex < currentCmdText.length) {
        const timer = setTimeout(() => {
          setCharIndex((prev) => prev + 1);
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Finished command typing!
        const timer = setTimeout(() => {
          setHistory((prev) => [
            ...prev,
            { type: "cmd", text: currentCmdText, cmdIdx: commandIndex },
          ]);
          setIsTypingCommand(false);

          if (currentCmdOutputs.length > 0) {
            setIsTypingOutput(true);
            setCurrentOutputLine(0);
            setCurrentOutputChar(0);
          } else {
            // No output for this command, move to next command after delay
            setCommandIndex((prev) => prev + 1);
            setCharIndex(0);
            setIsTypingCommand(true);
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }

    // Step B: Typing Outputs character by character, line by line
    if (isTypingOutput) {
      const lineText = currentCmdOutputs[currentOutputLine] ?? "";

      if (currentOutputChar < lineText.length) {
        const timer = setTimeout(() => {
          setCurrentOutputChar((prev) => prev + 1);
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Output line finished!
        const timer = setTimeout(() => {
          setHistory((prev) => [...prev, { type: "output", text: lineText }]);

          if (currentOutputLine < currentCmdOutputs.length - 1) {
            setCurrentOutputLine((prev) => prev + 1);
            setCurrentOutputChar(0);
          } else {
            // Finished all outputs for this command!
            setIsTypingOutput(false);
            const nextCmdTimer = setTimeout(() => {
              setCommandIndex((prev) => prev + 1);
              setCharIndex(0);
              setIsTypingCommand(true);
            }, delayBetweenCommands);
            return () => clearTimeout(nextCmdTimer);
          }
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [
    commandIndex,
    charIndex,
    currentOutputLine,
    currentOutputChar,
    isTypingCommand,
    isTypingOutput,
    typingSpeed,
    delayBetweenCommands,
    reduceMotion,
    isFinished,
  ]);

  const handleCopy = () => {
    const text = commands
      .map((cmd, idx) => {
        const outs = outputs[idx] ? outputs[idx].join("\n") : "";
        return `$ ${cmd}${outs ? "\n" + outs : ""}`;
      })
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplay = () => {
    setHistory([]);
    setCommandIndex(0);
    setCharIndex(0);
    setCurrentOutputLine(0);
    setCurrentOutputChar(0);
    setIsTypingCommand(true);
    setIsTypingOutput(false);
    setIsFinished(false);
  };

  return (
    <div
      ref={containerRef}
      onClick={() => {
        // Unblock audio on first user click (browser autoplay policy)
        const audio = audioRef.current;
        if (audio && soundEnabled) {
          audio.play().catch(() => {});
        }
      }}
      className={`relative w-full cursor-pointer overflow-hidden rounded-xl border-[3px] border-ink bg-ink shadow-[8px_8px_0_0_#0a0a0a] ${className}`}
    >
      {/* Hidden audio element for typing sound */}
      <audio ref={audioRef} src="/sounds/sound.ogg" preload="auto" loop />

      {/* Header Bar */}
      <div className="flex select-none items-center justify-between gap-2 border-b-[3px] border-ink bg-accent px-3 py-2.5 text-ink">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-ink bg-nb-red" />
          <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-ink bg-surface" />
          <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-ink bg-nb-green" />
          <span className="ml-2 hidden font-mono text-xs font-bold sm:inline">
            bash ~/imran-dev
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`rounded-md border-2 border-ink px-2 py-0.5 font-mono text-[11px] font-bold transition-all active:translate-x-px active:translate-y-px ${
              soundEnabled ? "bg-surface" : "bg-surface-2"
            }`}
            title={soundEnabled ? "Mute typing sound" : "Enable typing sound"}
          >
            {soundEnabled ? "🔊 Sound" : "🔇 Mute"}
          </button>
          <button
            onClick={handleReplay}
            className="rounded-md border-2 border-ink bg-ink px-2 py-0.5 font-mono text-[11px] font-bold text-white transition-all active:translate-x-px active:translate-y-px"
          >
            Replay ⚡
          </button>
          <button
            onClick={handleCopy}
            className="rounded-md border-2 border-ink bg-surface px-2 py-0.5 font-mono text-[11px] font-bold transition-all active:translate-x-px active:translate-y-px"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[220px] flex flex-col justify-start gap-1.5 select-text">
        {/* Render History */}
        {history.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {item.type === "cmd" ? (
              <>
                <span className="text-emerald-400 font-bold select-none">$</span>
                <span className="text-white font-semibold">{item.text}</span>
              </>
            ) : (
              <span
                className={`pl-4 ${
                  item.text.startsWith("✔") || item.text.startsWith("🟢") || item.text.startsWith("🚀")
                    ? "text-emerald-400 font-medium"
                    : item.text.startsWith("➜")
                    ? "font-semibold"
                    : "text-neutral-300"
                }`}
                style={item.text.startsWith("➜") ? { color: "var(--accent)" } : undefined}
              >
                {item.text}
              </span>
            )}
          </div>
        ))}

        {/* Currently typing command */}
        {isTypingCommand && commandIndex < commands.length && (
          <div className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold select-none">$</span>
            <span className="text-white font-semibold">
              {currentCmdText.slice(0, charIndex)}
            </span>
            <motion.span
              className="inline-block h-4 w-2 self-center -ml-1"
              style={{ background: "var(--accent)" }}
              animate={{ opacity: [1, 0] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        )}

        {/* Currently typing output */}
        {isTypingOutput && (
          <div className="flex items-start gap-2 pl-4">
            <span className="text-neutral-300">
              {currentCmdOutputs[currentOutputLine]?.slice(0, currentOutputChar)}
            </span>
            <motion.span
              className="inline-block h-4 w-2 self-center -ml-1"
              style={{ background: "var(--accent)" }}
              animate={{ opacity: [1, 0] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
