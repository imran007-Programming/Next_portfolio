import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { GalleryGrid } from "./GalleryGrid";
import { HeroScroll } from "./HeroScroll";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
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
  const heroImage = project.image;

  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground">

      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-black/5 bg-background/90 px-6 py-4 backdrop-blur-xl dark:border-white/5">
        <Link
          href="/#projects"
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to work
        </Link>
        {/* Prev / Next nav */}
        <div className="flex items-center gap-1 rounded-full border border-black/10 bg-black/4 p-1 dark:border-white/10 dark:bg-white/4">
          <Link
            href={`/projects/${projects[(index - 1 + projects.length) % projects.length].slug}`}
            aria-label="Previous project"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className="px-1 text-xs font-semibold tabular-nums text-accent/60">
            {num} / {String(projects.length).padStart(2, "0")}
          </span>
          <Link
            href={`/projects/${projects[(index + 1) % projects.length].slug}`}
            aria-label="Next project"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-12">

        {/* Hero image */}
        {project.scrollPreview ? (
          <HeroScroll src={heroImage} alt={project.title} />
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-black/8 bg-surface dark:border-white/8">
            <div className="relative h-[55vh] w-full overflow-hidden">
              <Image
                src={heroImage}
                alt={project.title}
                fill
                priority
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-surface/60 via-transparent to-transparent" />
            </div>
          </div>
        )}

        {/* Project info */}
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold tabular-nums text-accent/60">{num}</p>
              {project.details && (
                <>
                  <span className="h-3 w-px bg-black/15 dark:bg-white/15" />
                  <span className="rounded-full border border-black/10 px-2.5 py-0.5 text-xs font-medium text-muted dark:border-white/10">
                    {project.details.role}
                  </span>
                  <span className="rounded-full border border-black/10 px-2.5 py-0.5 text-xs font-medium text-muted dark:border-white/10">
                    {project.details.year}
                  </span>
                </>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">{project.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-muted">{project.description}</p>

            {/* Tech */}
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-accent/20 bg-accent/8 px-3 py-1 text-xs font-medium text-accent/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-row items-start gap-3 md:flex-col md:items-end">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-[#0b0f14] transition-shadow hover:shadow-[0_0_24px_rgba(45,212,191,0.4)]"
            >
              Live site ↗
            </a>
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 cursor-pointer rounded-full border border-black/15 px-6 py-2.5 text-sm font-medium text-muted transition-colors hover:border-black/30 hover:text-foreground dark:border-white/15 dark:hover:border-white/30"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Key highlights */}
        {project.details?.highlights && (
          <div className="mt-12">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-accent/40" />
              <p className="text-xs font-bold uppercase tracking-widest text-accent/70">Key Features</p>
              <span className="h-px flex-1 bg-black/5 dark:bg-white/5" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {project.details.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-black/6 bg-surface p-4 dark:border-white/6"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M20 6L9 17l-5-5" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed text-muted">{h}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-accent/40" />
              <p className="text-xs font-bold uppercase tracking-widest text-accent/70">Screenshots</p>
              <span className="h-px flex-1 bg-black/5 dark:bg-white/5" />
              <span className="text-xs text-muted/60">{project.gallery.length} images</span>
            </div>
            <GalleryGrid images={project.gallery} title={project.title} />
          </div>
        )}

        {/* Divider */}
        <div className="mt-16 h-px w-full bg-linear-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

        {/* Next project */}
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted/60">Next project</p>
          <Link
            href={`/projects/${next.slug}`}
            className="group mt-3 flex cursor-pointer items-center justify-between rounded-2xl border border-black/6 bg-surface p-5 transition-colors hover:border-accent/30 dark:border-white/6"
          >
            <div>
              <p className="text-xs tabular-nums text-accent/50">
                {String((index + 2) % projects.length === 0 ? projects.length : (index + 2)).padStart(2, "0")}
              </p>
              <p className="mt-0.5 text-lg font-bold text-foreground">{next.title}</p>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
            >
              <path d="M5 12h14M14 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </main>
    </div>
  );
}
