"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Message = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What projects has Imran built?",
  "What's his tech stack?",
  "Is he available for hire?",
  "How can I contact him?",
];

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}

export function ChatBot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm Imran's portfolio assistant. Ask me anything about his projects, skills, or availability!",
    },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread]   = useState(false);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message  = { role: "user", content: trimmed };
    const history           = [...messages, userMsg];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    setTimeout(() => inputRef.current?.focus(), 0);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) throw new Error("Network error");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: prev[prev.length - 1].content + chunk },
        ]);
      }

      if (!open) setUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages, open]);

  const showStarters = messages.length === 1;

  return (
    <>
      {/* ── Chat window ───────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-3 z-50 flex h-[500px] w-[340px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.25)] dark:border-white/10 sm:right-6 sm:w-95"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-3 border-b border-black/8 px-4 py-3 dark:border-white/8"
              style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.12) 0%, rgba(103,232,249,0.07) 100%)" }}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 3c-4.97 0-9 3.19-9 7 0 2.04 1.14 3.86 2.96 5.12l-.84 3.14 3.44-1.72c.96.27 1.97.46 3.06.46 4.97 0 9-3.19 9-7s-4.03-7-9-7z" fill="#2dd4bf" fillOpacity="0.9" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">Portfolio Assistant</p>
                <p className="text-[10px] text-accent/70">Ask about Imran&apos;s work &amp; skills</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <span className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12 3c-4.97 0-9 3.19-9 7 0 2.04 1.14 3.86 2.96 5.12l-.84 3.14 3.44-1.72c.96.27 1.97.46 3.06.46 4.97 0 9-3.19 9-7s-4.03-7-9-7z" />
                      </svg>
                    </span>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-sm bg-accent text-[#0b0f14]"
                        : "rounded-bl-sm bg-surface-2 text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" && !msg.content && loading && i === messages.length - 1
                      ? <TypingDots />
                      : msg.content}
                  </div>
                </div>
              ))}

              {/* Starter suggestions */}
              {showStarters && (
                <div className="mt-1 flex flex-col gap-1.5">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage(s)}
                      className="rounded-xl border border-accent/20 bg-accent/6 px-3.5 py-2 text-left text-xs font-medium text-accent/80 transition-colors hover:border-accent/40 hover:bg-accent/12 hover:text-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="shrink-0 border-t border-black/8 p-3 dark:border-white/8"
            >
              <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-surface-2 px-3 py-2 transition-colors focus-within:border-accent/40 dark:border-white/10">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything…"
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted/50 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-[#0b0f14] transition-opacity disabled:opacity-40"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="mt-1.5 text-center text-[9px] text-muted/40">Powered by Groq · Llama 3.1</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle button ─────────────────────────────────────────── */}
      <motion.button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-3 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-accent shadow-[0_4px_24px_rgba(45,212,191,0.45)] transition-shadow hover:shadow-[0_4px_32px_rgba(45,212,191,0.65)] sm:right-6"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 30, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <path d="M18 6L6 18M6 6l12 12" stroke="#0b0f14" strokeWidth="2.5" strokeLinecap="round" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              width="22" height="22" viewBox="0 0 24 24" fill="none"
              initial={{ rotate: 30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -30, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#0b0f14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Unread dot */}
        {unread && !open && (
          <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-background bg-red-500" />
        )}
      </motion.button>
    </>
  );
}
