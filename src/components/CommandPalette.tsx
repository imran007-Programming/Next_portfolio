"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/data/site";
import { projects } from "@/data/projects";

type CommandItem = {
  id: string;
  category: "Navigation" | "Projects" | "Social & Contact" | "Actions";
  title: string;
  subtitle?: string;
  icon: string;
  action: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const scrollTo = useCallback((id: string) => {
    close();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, [close]);

  const items: CommandItem[] = [
    // Navigation
    { id: "nav-hero", category: "Navigation", title: "Go to Home", subtitle: "Hero section", icon: "🏠", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { id: "nav-about", category: "Navigation", title: "About Me", subtitle: "Bio, stats & github activity", icon: "👤", action: () => scrollTo("about") },
    { id: "nav-skills", category: "Navigation", title: "Tech Stack", subtitle: "Frontend, Backend & Tools", icon: "⚡", action: () => scrollTo("skills") },
    { id: "nav-projects", category: "Navigation", title: "Projects", subtitle: "Shipped applications", icon: "🚀", action: () => scrollTo("projects") },
    { id: "nav-contact", category: "Navigation", title: "Contact", subtitle: "Get in touch", icon: "✉️", action: () => scrollTo("contact") },

    // Projects
    ...projects.map((p) => ({
      id: `proj-${p.slug}`,
      category: "Projects" as const,
      title: p.title,
      subtitle: p.tech.slice(0, 3).join(" · "),
      icon: "💻",
      action: () => {
        close();
        window.open(p.liveUrl, "_blank");
      },
    })),

    // Social & Contact
    { id: "soc-email", category: "Social & Contact", title: "Send Email", subtitle: site.email, icon: "📧", action: () => { close(); window.location.href = `mailto:${site.email}`; } },
    { id: "soc-github", category: "Social & Contact", title: "GitHub Profile", subtitle: "@imran007-Programming", icon: "🐙", action: () => { close(); window.open(site.github, "_blank"); } },
    { id: "soc-linkedin", category: "Social & Contact", title: "LinkedIn", subtitle: "Connect professionally", icon: "💼", action: () => { close(); window.open(site.linkedin, "_blank"); } },
    { id: "soc-whatsapp", category: "Social & Contact", title: "WhatsApp", subtitle: site.phone, icon: "💬", action: () => { close(); window.open(site.whatsapp, "_blank"); } },

    // Actions
    { id: "act-copy-email", category: "Actions", title: "Copy Email Address", subtitle: site.email, icon: "📋", action: () => { close(); navigator.clipboard.writeText(site.email); } },
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  /* Keyboard shortcutlistener (Cmd+K / Ctrl+K) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  /* Keyboard arrow navigation inside menu */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
    }
  };

  return (
    <>
      {/* Search trigger button in header (floating) */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 rounded-lg border-2 border-ink bg-surface px-2.5 py-1.5 text-xs font-bold transition-all duration-150 hover:bg-surface-2 hover:shadow-[2px_2px_0_0_#0a0a0a]"
        title="Open Command Palette (Cmd + K)"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2.5" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <kbd className="rounded border-2 border-ink bg-accent px-1 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-120 flex items-start justify-center pt-20 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-ink/60" />

            {/* Dialog */}
            <motion.div
              className="relative w-full max-w-xl overflow-hidden rounded-xl border-[3px] border-ink bg-surface shadow-[8px_8px_0_0_#0a0a0a]"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input bar */}
              <div className="flex items-center gap-3 border-b-[3px] border-ink bg-accent px-4 py-3.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="w-full bg-transparent text-sm font-semibold text-ink placeholder:text-ink/60 outline-none"
                />
                <button
                  onClick={close}
                  className="rounded-md border-2 border-ink bg-surface px-2 py-0.5 font-mono text-[10px] font-bold"
                >
                  ESC
                </button>
              </div>

              {/* Items list */}
              <div className="flex max-h-80 flex-col gap-1 overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <p className="p-4 text-center text-xs font-semibold">No matching results found.</p>
                ) : (
                  filtered.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex w-full items-center justify-between rounded-lg border-2 px-3.5 py-2.5 text-left text-sm transition-all ${
                          isSelected ? "border-ink bg-accent shadow-[3px_3px_0_0_#0a0a0a]" : "border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base">{item.icon}</span>
                          <div>
                            <p className="font-bold leading-none">{item.title}</p>
                            {item.subtitle && (
                              <p className="mt-1 text-[11px] font-medium text-muted">{item.subtitle}</p>
                            )}
                          </div>
                        </div>
                        <span className="rounded border-2 border-ink bg-surface px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                          {item.category}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer navigation guide */}
              <div className="flex items-center justify-between border-t-[3px] border-ink bg-surface-2 px-4 py-2.5 text-[11px] font-semibold">
                <div className="flex items-center gap-3">
                  <span><kbd className="rounded border-2 border-ink bg-surface px-1.5 py-0.5">↑↓</kbd> Navigate</span>
                  <span><kbd className="rounded border-2 border-ink bg-surface px-1.5 py-0.5">↵</kbd> Select</span>
                </div>
                <span>Imran Portfolio OS</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
