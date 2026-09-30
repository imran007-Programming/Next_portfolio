"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { FaqAccordion } from "@/components/FaqAccordion";

type FormState = { name: string; email: string; message: string };
const initialForm: FormState = { name: "", email: "", message: "" };

const labelClass = "mb-2 block text-xs font-extrabold uppercase tracking-widest";

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
      <section id="contact" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">

        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: Big CTA + info ── */}
          <div>
            <p className="nb-tag mb-6 -rotate-1 bg-surface px-3 py-1 font-mono text-xs uppercase tracking-[0.2em]">
              <span className="h-2 w-2 rounded-full bg-ink" />
              Contact
            </p>

            <h2 className="font-display text-[clamp(2rem,4.4vw,3.6rem)] uppercase leading-[1.08]">
              Let&apos;s build something{" "}
              <span className="nb-mark mt-2 rotate-[-1.5deg] px-3">together.</span>
            </h2>

            <p className="mt-6 text-base font-medium leading-relaxed text-muted">
              Have a project in mind or looking for a developer? Drop a message and I&apos;ll get back to you within 24 hours.
            </p>

            {/* Contact info */}
            <motion.div
              className="nb-card mt-10 flex flex-col divide-y-[3px] divide-ink overflow-hidden"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {[
                { label: "Email", value: site.email, href: `mailto:${site.email}`, bg: "var(--nb-yellow)" },
                { label: "WhatsApp", value: site.phone, href: site.whatsapp, bg: "var(--nb-green)" },
                { label: "Location", value: site.location, href: undefined, bg: "var(--nb-blue)" },
              ].map((item) => (
                <div key={item.label} className="flex items-stretch">
                  <span
                    className="flex w-28 shrink-0 items-center border-r-[3px] border-ink px-4 py-3 text-[11px] font-extrabold uppercase tracking-widest"
                    style={{ background: item.bg }}
                  >
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex min-w-0 flex-1 items-center break-all px-4 py-3 text-sm font-bold underline-offset-4 hover:bg-surface-2 hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="flex flex-1 items-center px-4 py-3 text-sm font-bold">{item.value}</span>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Socials */}
            <motion.div
              className="mt-7 flex gap-3"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
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
                  className="nb-btn bg-surface px-5 py-2 text-sm hover:bg-accent"
                >
                  {s.label} ↗
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.1 }}
          >
            {submitted ? (
              <div className="nb-card flex flex-col items-center justify-center bg-nb-green py-16 text-center">
                <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-ink bg-surface text-3xl shadow-[3px_3px_0_0_#0a0a0a]">✓</span>
                <h3 className="font-display text-xl uppercase">
                  Message sent!
                </h3>
                <p className="mt-2 text-sm font-semibold">
                  I&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="nb-btn mt-6 bg-surface px-5 py-2 text-xs uppercase"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="nb-card flex flex-col gap-5 bg-surface p-6 sm:p-8">
                <div className="-mx-6 -mt-6 mb-1 flex items-center justify-between border-b-[3px] border-ink bg-accent px-6 py-3 sm:-mx-8 sm:-mt-8 sm:px-8">
                  <span className="font-display text-sm uppercase">Send a message</span>
                  <span className="font-mono text-xs font-bold">✉ reply &lt; 24h</span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      required
                      className="nb-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      required
                      className="nb-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    required
                    className="nb-input resize-y"
                  />
                </div>

                {error && (
                  <p className="rounded-lg border-2 border-ink bg-nb-red px-3 py-2 text-sm font-bold">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="nb-btn group mt-2 bg-ink py-4 text-base uppercase tracking-wide text-white"
                >
                  <span>{loading ? "Sending Message..." : "Send Message"}</span>
                  {!loading && (
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

      </div>
    </section>

    {/* ── FAQ Section ── */}
    <section id="faq" className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <SectionHeading eyebrow="FAQs" title="Your Questions, {Answered}" className="mb-12" />
        <FaqAccordion />
      </div>
    </section>
    </>
  );
}
