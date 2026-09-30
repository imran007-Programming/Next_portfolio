interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, className = "" }: SectionHeadingProps) {
  const parts = title.split(/(\{.*?\})/g);

  return (
    <div className={`flex flex-col items-start gap-5 ${className}`}>
      {eyebrow && (
        <p className="nb-tag -rotate-1 bg-surface px-3 py-1 font-mono text-xs uppercase tracking-[0.2em]">
          <span className="h-2 w-2 rounded-full bg-ink" />
          {eyebrow}
        </p>
      )}
      <h2 className="font-display flex flex-wrap items-center gap-x-[0.3em] gap-y-3 text-[clamp(1.8rem,4vw,3.2rem)] uppercase leading-[1.05]">
        {parts.map((part, index) => {
          const isHighlight = part.startsWith("{") && part.endsWith("}");
          const cleanText = isHighlight ? part.slice(1, -1).trim() : part.trim();
          if (!cleanText) return null;
          return isHighlight ? (
            <span key={index} className="nb-mark rotate-[-1.5deg] px-3 py-1">
              {cleanText}
            </span>
          ) : (
            <span key={index}>{cleanText}</span>
          );
        })}
      </h2>
    </div>
  );
}
