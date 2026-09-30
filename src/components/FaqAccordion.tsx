"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const faqs = [
  {
    q: "What technologies do you primarily work with?",
    a: "I specialise in the React/Next.js ecosystem for frontend and Node.js (Express, NestJS) for backend, with PostgreSQL and MongoDB as my primary databases. I also work with TypeScript, Tailwind CSS, Prisma ORM, Docker, and deploy via Vercel or cloud platforms.",
  },
  {
    q: "Are you available for remote full-time or freelance work?",
    a: "Yes — I'm fully remote-ready and available for both full-time positions and freelance/contract engagements. I'm experienced with async communication across time zones using tools like Slack, Linear, and Notion.",
  },
  {
    q: "What does your typical project timeline look like?",
    a: "A landing page or portfolio takes 1–2 weeks. A full-stack MVP (authentication, database, dashboards) typically runs 4–8 weeks depending on scope. I always start with a brief discovery phase to align on requirements before writing a single line of code.",
  },
  {
    q: "Can you work on just frontend or just backend?",
    a: "Absolutely. While I enjoy full-stack projects, I'm happy to join a team as a dedicated frontend engineer (React/Next.js) or backend engineer (Node.js/APIs/databases). I can also do code reviews, architecture consulting, or short-term bug-fix sprints.",
  },
  {
    q: "How do you handle communication during a project?",
    a: "I provide structured weekly updates, maintain a shared task board, and am available via Slack or email during agreed working hours. I document my APIs and key decisions so the handoff is smooth and the codebase remains maintainable long after I'm done.",
  },
];

export function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-4">
      {faqs.map((faq, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-xl border-[3px] border-ink bg-surface transition-shadow duration-150 ${
              isOpen ? "shadow-[6px_6px_0_0_#0a0a0a]" : "shadow-[3px_3px_0_0_#0a0a0a]"
            }`}
          >
            <button
              className={`flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors duration-150 ${
                isOpen ? "bg-accent" : "hover:bg-surface-2"
              }`}
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="text-base font-bold leading-snug">
                {faq.q}
              </span>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-[3px] border-ink ${
                  isOpen ? "bg-ink text-white" : "bg-surface"
                }`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="answer"
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="border-t-[3px] border-ink px-5 py-5 text-sm font-medium leading-relaxed text-muted">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
