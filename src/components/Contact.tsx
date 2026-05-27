"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { ShutterButton } from "@/components/motion/ShutterButton";
import { site } from "@/data/site";

type FormState = {
  name: string;
  email: string;
  description: string;
};

const initialForm: FormState = { name: "", email: "", description: "" };

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

    if (!form.name.trim() || !form.email.trim() || !form.description.trim()) {
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
          description: form.description.trim(),
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
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Let&apos;s work together
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-zinc-400">
              Have a project in mind or want to hire me? Fill out the form and
              I&apos;ll get back to you as soon as possible.
            </p>

            <div className="mt-8 space-y-3 text-sm text-zinc-500">
              <p>
                <span className="text-zinc-400">Email: </span>
                <a
                  href={`mailto:${site.email}`}
                  className="text-accent hover:underline"
                >
                  {site.email}
                </a>
              </p>
              <p>
                <span className="text-zinc-400">Location: </span>
                {site.location}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <motion.form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-white/2 p-6 md:p-8"
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-5">
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
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Tell me about your project or role..."
                    disabled={loading}
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0f14]/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-accent/50 focus:ring-1 focus:ring-accent/30 disabled:opacity-50"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}

              {submitted && (
                <p className="mt-4 text-sm text-accent" role="status">
                  Message sent successfully. I&apos;ll reply soon!
                </p>
              )}

              <div className="mt-6">
                <ShutterButton
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Send Message"}
                </ShutterButton>
              </div>
            </motion.form>
          </FadeIn>
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
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-white/10 bg-[#0b0f14]/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-accent/50 focus:ring-1 focus:ring-accent/30 disabled:opacity-50"
      />
    </div>
  );
}
