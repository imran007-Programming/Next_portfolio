import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { GalleryGrid } from "./GalleryGrid";
import { HeroScroll } from "./HeroScroll";
import { LiveButton, NextProjectCard } from "./ProjectInteractive";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const TECH_COLORS: Record<string, string> = {
  "React": "#38bdf8", "Next.js": "#a3a3a3", "TypeScript": "#60a5fa",
  "JavaScript": "#fbbf24", "Tailwind CSS": "#2dd4bf", "Vite": "var(--accent)",
  "Framer Motion": "#f472b6", "Vercel": "#94a3b8", "CSS": "#818cf8",
  "Audio API": "#34d399", "Node.js": "#86efac", "Express": "#c9d1d9",
  "Prisma": "#a5b4fc", "PostgreSQL": "#93c5fd", "MongoDB": "#6ee7b7",
  "Mongoose": "#fca5a5",
};
const FALLBACK = ["#fb923c", "#e879f9", "#4ade80", "#f87171", "#facc15"];
function techColor(name: string, idx: number) {
  return TECH_COLORS[name] ?? FALLBACK[idx % FALLBACK.length];
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const num = String(index + 1).padStart(2, "0");
  const nextNum = String((index + 2) > projects.length ? 1 : index + 2).padStart(2, "0");

  return (
    <div className="min-h-screen selection:bg-sky-500/30 selection:text-white" style={{ background: "#080808", color: "#f0f0f0" }}>

      {/* ── Ambient purple background glow ── */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 z-0 h-[500px] w-full max-w-7xl opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle at top, var(--accent-dim) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* ── Sticky Top Bar ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10"
        style={{
          background: "rgba(8,8,8,0.92)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <Link
          href="/#projects"
          className="group flex items-center gap-2 text-sm font-semibold transition-colors duration-200 hover:text-white"
          style={{ color: "#a3a3a3" }}
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden
            className="transition-transform duration-200 group-hover:-translate-x-1"
          >
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Work
        </Link>

        {/* Counter & Prev/Next */}
        <div
          className="flex items-center gap-1.5 rounded-full p-1.5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Link
            href={`/projects/${projects[(index - 1 + projects.length) % projects.length].slug}`}
            aria-label="Previous project"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10"
            style={{ color: "#a3a3a3" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className="px-2 font-mono text-xs font-bold tabular-nums" style={{ color: "var(--accent)" }}>
            {num} / {String(projects.length).padStart(2, "0")}
          </span>
          <Link
            href={`/projects/${projects[(index + 1) % projects.length].slug}`}
            aria-label="Next project"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10"
            style={{ color: "#a3a3a3" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-28 pt-10 md:px-10">

        {/* ── Project Header Title ── */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm font-bold tabular-nums" style={{ color: "var(--accent)" }}>
              Case Study #{num}
            </span>
            {project.details && (
              <>
                <span className="h-3 w-px" style={{ background: "rgba(255,255,255,0.15)" }} />
                <span
                  className="rounded-full px-3 py-0.5 text-xs font-semibold"
                  style={{ background: "var(--accent-dim)", border: "1px solid var(--accent)", color: "var(--accent)" }}
                >
                  {project.details.role}
                </span>
                <span
                  className="rounded-full px-3 py-0.5 text-xs font-semibold"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#a3a3a3" }}
                >
                  {project.details.year}
                </span>
              </>
            )}
          </div>

          <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold tracking-tight leading-[1.05]" style={{ color: "#f5f5f5" }}>
            {project.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-relaxed md:text-lg" style={{ color: "#a3a3a3" }}>
            {project.description}
          </p>
        </div>

        {/* ── Hero Image / Preview Box ── */}
        <div
          className="overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:border-sky-500/30"
          style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(17,17,17,0.7)" }}
        >
          {project.scrollPreview ? (
            <HeroScroll src={project.image} alt={project.title} />
          ) : (
            <div className="relative h-[55vh] w-full overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                className="object-cover object-top transition-transform duration-700 hover:scale-102"
                sizes="100vw"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 60%)" }}
              />
            </div>
          )}
        </div>

        {/* ── Actions & Tech Stack Row ── */}
        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
              Tech Stack &amp; Tools
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((t, ti) => {
                const c = techColor(t, ti);
                return (
                  <span
                    key={t}
                    className="rounded-full px-3.5 py-1 text-xs font-bold transition-transform duration-200 hover:scale-105"
                    style={{ background: `${c}18`, border: `1px solid ${c}35`, color: c }}
                  >
                    {t}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LiveButton href={project.liveUrl} />
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:border-white/30 hover:text-white"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#a3a3a3" }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* ── Key Metrics Cards ── */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="group rounded-2xl p-6 text-center transition-all duration-300 hover:border-sky-500/40 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-3xl font-extrabold tabular-nums transition-colors group-hover:text-accent" style={{ color: "var(--accent)" }}>
                  {m.value}
                </p>
                <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#a3a3a3" }}>
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Key Features Checklist ── */}
        {project.details?.highlights && (
          <div className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8" style={{ background: "var(--accent)" }} />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                Key Features &amp; Engineering Highlights
              </p>
              <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {project.details.highlights.map((h, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-3.5 rounded-2xl p-5 transition-all duration-300 hover:border-sky-500/30"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                    style={{ background: "var(--accent-dim)", border: "1px solid var(--accent)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M20 6L9 17l-5-5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "#d4d4d4" }}>{h}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Gallery Screenshots ── */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-20">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8" style={{ background: "var(--accent)" }} />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                Project Screenshots &amp; Gallery
              </p>
              <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="text-xs font-mono" style={{ color: "#a3a3a3" }}>
                {project.gallery.length} Images
              </span>
            </div>
            <GalleryGrid images={project.gallery} title={project.title} />
          </div>
        )}

        {/* ── Bottom Section Divider ── */}
        <div className="mt-20 h-px w-full" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* ── Next Project Card ── */}
        <div className="mt-12">
          <NextProjectCard
            href={`/projects/${next.slug}`}
            num={nextNum}
            title={next.title}
          />
        </div>

      </main>
    </div>
  );
}
