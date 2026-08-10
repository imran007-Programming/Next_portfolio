"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Framer3DWordFlip, FramerBlurWordReveal } from "@/components/TextReveal";

type FormState = { name: string; email: string; message: string };
const initialForm: FormState = { name: "", email: "", message: "" };

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  padding: "0.875rem 1rem",
  color: "var(--foreground)",
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

export function Contact() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    if (error) setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      setSubmitted(true);
      setForm(initialForm);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section
        id="contact"
        className="border-t py-24 md:py-32"
        style={{ borderColor: "var(--border)" }}
      >
      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* ── Section label ── */}
        <motion.p
          className="mb-12 font-mono text-xs uppercase tracking-[0.25em]"
          style={{ color: "var(--accent)" }}
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Contact
        </motion.p>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">

          {/* ── Left: Big CTA + info ── */}
          <div>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight tracking-tight" style={{ color: "var(--foreground)" }}>
              <Framer3DWordFlip text="Let's build something" delay={0.1} />{" "}
              <span style={{ color: "var(--accent)" }}>
                <Framer3DWordFlip text="together." delay={0.3} />
              </span>
            </h2>

            <div className="mt-5 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
              <FramerBlurWordReveal text="Have a project in mind or looking for a developer? Drop a message and I'll get back to you within 24 hours." delay={0.2} />
            </div>

            {/* Contact info */}
            <motion.div
              className="mt-10 flex flex-col gap-4"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              {[
                { label: "Email", value: site.email, href: `mailto:${site.email}` },
                { label: "WhatsApp", value: site.phone, href: site.whatsapp },
                { label: "Location", value: site.location, href: undefined },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span
                    className="w-20 text-xs font-bold uppercase tracking-widest"
                    style={{ color: "var(--muted)" }}
                  >
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-sm transition-colors duration-200 hover:text-white"
                      style={{ color: "var(--foreground)" }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: "var(--foreground)" }}>{item.value}</span>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Socials */}
            <motion.div
              className="mt-8 flex gap-3"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
            >
              {[
                { label: "GitHub", href: site.github },
                { label: "LinkedIn", href: site.linkedin },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border px-5 py-2 text-xs font-medium transition-all duration-300 hover:border-white/20 hover:text-white"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  {s.label} ↗
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Simple Clean Form ── */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {submitted ? (
              <div
                className="flex flex-col items-center justify-center rounded-2xl border py-16 text-center"
                style={{ borderColor: "rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.04)" }}
              >
                <span className="mb-4 text-4xl">✅</span>
                <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                  Message sent!
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  I&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-lg border px-5 py-2 text-xs font-medium"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-widest"
                      style={{ color: "var(--muted)" }}
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      required
                      style={inputStyle}
                      onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--accent)"; }}
                      onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "var(--border)"; }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-widest"
                      style={{ color: "var(--muted)" }}
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      required
                      style={inputStyle}
                      onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--accent)"; }}
                      onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "var(--border)"; }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-widest"
                    style={{ color: "var(--muted)" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    required
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--accent)"; }}
                    onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "var(--border)"; }}
                  />
                </div>

                {error && (
                  <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="group relative overflow-hidden mt-3 flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all duration-300 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }}
                  whileHover={loading ? undefined : { scale: 1.02, y: -2, boxShadow: "0 0 35px rgba(139,92,246,0.6)" }}
                  whileTap={loading ? undefined : { scale: 0.96 }}
                >
                  {/* Continuous Sheen Beam Sweep */}
                  <motion.span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-20deg]"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="relative z-10">{loading ? "Sending Message..." : "Send Message"}</span>
                  {!loading && (
                    <span className="relative z-10 text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>

      </div>
    </section>

    {/* ── FAQ Section ── */}
    <section
      id="faq"
      className="relative border-t py-24 md:py-32"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Animated Ambient Glow Overlay */}
        <motion.div
          className="absolute left-1/4 top-10 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-[130px] pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute right-1/4 bottom-10 -z-10 h-80 w-80 rounded-full bg-purple-600/10 blur-[130px] pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
        />

        <SectionHeading eyebrow="FAQs" title="Your Questions, {Answered}" className="mb-10" />
        <FaqAccordion />
      </div>
    </section>
    </>
  );
}
