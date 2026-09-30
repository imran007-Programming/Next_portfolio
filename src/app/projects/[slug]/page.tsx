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

const PILL_COLORS = ["var(--nb-yellow)", "var(--nb-pink)", "var(--nb-blue)", "var(--nb-green)", "var(--nb-orange)", "var(--nb-purple)"];
const METRIC_COLORS = ["var(--nb-pink)", "var(--nb-blue)", "var(--nb-green)"];

function SectionLabel({ children, extra }: { children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <p className="nb-tag bg-accent px-3 py-1 text-xs uppercase tracking-widest">{children}</p>
      <span className="h-[3px] flex-1 bg-ink" />
      {extra}
    </div>
  );
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
    <div className="min-h-screen text-ink">

      {/* ── Sticky Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b-[3px] border-ink bg-surface px-6 py-3 md:px-10">
        <Link href="/#projects" className="nb-btn group bg-surface px-4 py-2 text-sm">
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden
            className="transition-transform duration-200 group-hover:-translate-x-1"
          >
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Work
        </Link>

        {/* Counter & Prev/Next */}
        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${projects[(index - 1 + projects.length) % projects.length].slug}`}
            aria-label="Previous project"
            className="nb-btn h-9 w-9 bg-surface"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className="nb-tag bg-accent px-2.5 py-1 font-mono text-xs tabular-nums">
            {num} / {String(projects.length).padStart(2, "0")}
          </span>
          <Link
            href={`/projects/${projects[(index + 1) % projects.length].slug}`}
            aria-label="Next project"
            className="nb-btn h-9 w-9 bg-surface"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-28 pt-12 md:px-10">

        {/* ── Project Header Title ── */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="nb-tag -rotate-2 bg-ink px-3 py-1 font-mono text-sm text-white">
              Case Study #{num}
            </span>
            {project.details && (
              <>
                <span className="nb-tag bg-nb-pink px-3 py-1 text-xs">
                  {project.details.role}
                </span>
                <span className="nb-tag bg-surface px-3 py-1 text-xs">
                  {project.details.year}
                </span>
              </>
            )}
          </div>

          <h1 className="font-display mt-6 text-[clamp(2.4rem,6vw,4.6rem)] uppercase leading-[1.02]">
            {project.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-muted md:text-lg">
            {project.description}
          </p>
        </div>

        {/* ── Hero Image / Preview Box ── */}
        <div className="nb-card overflow-hidden shadow-[8px_8px_0_0_#0a0a0a]">
          {project.scrollPreview ? (
            <HeroScroll src={project.image} alt={project.title} />
          ) : (
            <div className="relative h-[55vh] w-full overflow-hidden bg-surface-2">
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                className="object-cover object-top"
                sizes="100vw"
              />
            </div>
          )}
        </div>

        {/* ── Actions & Tech Stack Row ── */}
        <div className="mt-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest">
              Tech Stack &amp; Tools
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t, ti) => (
                <span
                  key={t}
                  className="rounded-md border-2 border-ink px-3 py-1 text-xs font-bold shadow-[2px_2px_0_0_#0a0a0a]"
                  style={{ background: PILL_COLORS[ti % PILL_COLORS.length] }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LiveButton href={project.liveUrl} />
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nb-btn bg-surface px-6 py-3 text-sm"
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
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {project.metrics.map((m, i) => (
              <div
                key={m.label}
                className="nb-card nb-hover p-6 text-center"
                style={{ background: METRIC_COLORS[i % METRIC_COLORS.length] }}
              >
                <p className="font-display text-4xl tabular-nums">
                  {m.value}
                </p>
                <p className="mt-2 text-xs font-extrabold uppercase tracking-wider">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Key Features Checklist ── */}
        {project.details?.highlights && (
          <div className="mt-16">
            <SectionLabel>Key Features &amp; Highlights</SectionLabel>

            <div className="grid gap-4 sm:grid-cols-2">
              {project.details.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 rounded-xl border-[3px] border-ink bg-surface p-5 shadow-[4px_4px_0_0_#0a0a0a]"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-nb-green">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M20 6L9 17l-5-5" stroke="#0a0a0a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="text-sm font-medium leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Gallery Screenshots ── */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-20">
            <SectionLabel
              extra={
                <span className="nb-tag bg-surface px-2 py-0.5 font-mono text-xs">
                  {project.gallery.length} Images
                </span>
              }
            >
              Screenshots &amp; Gallery
            </SectionLabel>
            <GalleryGrid images={project.gallery} title={project.title} />
          </div>
        )}

        {/* ── Next Project Card ── */}
        <div className="mt-20">
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
