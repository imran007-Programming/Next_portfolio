"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShutterButton } from "@/components/motion/ShutterButton";
import { site } from "@/data/site";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const initialForm: FormState = { name: "", email: "", message: "" };

const contactInfo = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
        <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.862L.057 23.082a.75.75 0 0 0 .921.921l5.22-1.475A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.367l-.36-.214-3.717 1.051 1.051-3.717-.214-.36A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
      </svg>
    ),
    label: "WhatsApp",
    value: site.phone,
    href: site.whatsapp,
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    label: "Location",
    value: site.location,
    href: undefined,
  },
];

const socials = [
  {
    label: "GitHub",
    href: site.github,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: site.linkedin,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

export function Contact() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSubmitted(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          description: form.message.trim(),
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      setForm(initialForm);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="h-full overflow-y-auto py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6">

        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          className="mb-10"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Contact
          </p>
          <motion.span
            className="mt-1.5 block h-0.5 w-8 rounded-full bg-linear-to-r from-accent to-cyan-300"
            style={{ originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [1, 2, 1] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <h2 className="mt-3 text-3xl font-bold leading-tight text-foreground md:text-4xl">
            Let&apos;s build something{" "}
            <span className="bg-linear-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
              together
            </span>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Have a project in mind or looking for a developer? Drop a message
            and I&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* ── Grid ──────────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr] lg:items-start">

          {/* Left column */}
          <div className="flex flex-col gap-4">

            {/* Availability badge */}
            <motion.div
              className="flex items-center gap-3 rounded-xl border border-accent/25 bg-accent/8 px-5 py-3.5"
              initial={reduceMotion ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <motion.span
                className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent"
                animate={reduceMotion ? undefined : { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">
                  Open to work
                </p>
                <p className="text-xs text-muted">Available for remote roles &amp; freelance</p>
              </div>
            </motion.div>

            {/* Contact info cards */}
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                className="group flex items-center gap-4 rounded-xl border border-black/8 bg-surface p-4 transition-colors hover:border-accent/30 dark:border-white/8"
                initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.08 }}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
                  {item.icon}
                </span>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-foreground transition-colors hover:text-accent"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Social links */}
            <motion.div
              className="flex gap-3 pt-1"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.32 }}
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-muted transition-all hover:border-accent/40 hover:text-accent dark:border-white/10"
                >
                  {s.icon}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right column — form card */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-black/8 bg-surface dark:border-white/8"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* Gradient top border */}
            <div
              className="absolute inset-x-0 top-0 h-0.5"
              style={{ background: "linear-gradient(90deg, #2dd4bf 0%, #67e8f9 50%, #a78bfa 100%)" }}
              aria-hidden
            />

            {/* Glow */}
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/8 blur-3xl"
              aria-hidden
            />

            <form onSubmit={handleSubmit} className="relative p-7 md:p-9">
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <FormField
                  id="name"
                  label="Name"
                  value={form.name}
                  onChange={(v) => updateField("name", v)}
                  placeholder="Your name"
                  disabled={loading}
                />
                <FormField
                  id="email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => updateField("email", v)}
                  placeholder="you@email.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-foreground/80"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Tell me about your project or what you're looking for..."
                  disabled={loading}
                  className="w-full resize-none rounded-xl border border-black/10 bg-surface-2 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent/50 focus:ring-1 focus:ring-accent/30 disabled:opacity-50 dark:border-white/10"
                />
              </div>

              {error && (
                <p className="mt-3 text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}

              {submitted && (
                <motion.p
                  className="mt-3 text-sm text-accent"
                  role="status"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Message sent! I&apos;ll reply within 24 hours.
                </motion.p>
              )}

              <div className="mt-6">
                <ShutterButton type="submit" variant="primary" disabled={loading}>
                  {loading ? "Sending…" : "Send Message →"}
                </ShutterButton>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground/80">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-black/10 bg-surface-2 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent/50 focus:ring-1 focus:ring-accent/30 disabled:opacity-50 dark:border-white/10"
      />
    </div>
  );
}
