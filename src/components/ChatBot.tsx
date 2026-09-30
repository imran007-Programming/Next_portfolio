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
          className="h-2 w-2 rounded-full bg-ink"
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
            className="fixed bottom-24 right-3 z-50 flex h-[500px] w-[340px] flex-col overflow-hidden rounded-xl border-[3px] border-ink bg-surface shadow-[8px_8px_0_0_#0a0a0a] sm:right-6 sm:w-95"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-3 border-b-[3px] border-ink bg-accent px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-surface">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 3c-4.97 0-9 3.19-9 7 0 2.04 1.14 3.86 2.96 5.12l-.84 3.14 3.44-1.72c.96.27 1.97.46 3.06.46 4.97 0 9-3.19 9-7s-4.03-7-9-7z" fill="#0a0a0a" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm uppercase">Portfolio Assistant</p>
                <p className="text-[11px] font-semibold">Ask about Imran&apos;s work &amp; skills</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink bg-surface transition-colors hover:bg-ink hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-background p-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <span className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-accent">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12 3c-4.97 0-9 3.19-9 7 0 2.04 1.14 3.86 2.96 5.12l-.84 3.14 3.44-1.72c.96.27 1.97.46 3.06.46 4.97 0 9-3.19 9-7s-4.03-7-9-7z" />
                      </svg>
                    </span>
                  )}
                  <div
                    className={`max-w-[78%] rounded-xl border-2 border-ink px-3.5 py-2.5 text-sm font-medium leading-relaxed shadow-[2px_2px_0_0_#0a0a0a] ${
                      msg.role === "user"
                        ? "rounded-br-sm bg-accent"
                        : "rounded-bl-sm bg-surface"
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
                      className="rounded-lg border-2 border-ink bg-surface px-3.5 py-2 text-left text-xs font-bold transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-accent hover:shadow-[3px_3px_0_0_#0a0a0a]"
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
              className="shrink-0 border-t-[3px] border-ink bg-surface p-3"
            >
              <div className="flex items-center gap-2 rounded-lg border-2 border-ink bg-surface px-3 py-2 transition-shadow focus-within:shadow-[3px_3px_0_0_#0a0a0a]">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything…"
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-muted disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-accent transition-opacity disabled:opacity-40"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="mt-1.5 text-center text-[9px] font-semibold text-muted">Powered by Groq · Llama 3.1</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle button ─────────────────────────────────────────── */}
      <motion.button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-3 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border-[3px] border-ink bg-accent shadow-[4px_4px_0_0_#0a0a0a] sm:right-6"
        whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0 0 #0a0a0a" }}
        whileTap={{ x: 3, y: 3, boxShadow: "0px 0px 0 0 #0a0a0a" }}
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
          <span className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full border-2 border-ink bg-nb-red" />
        )}
      </motion.button>
    </>
  );
}
