import type { ReactNode } from "react";

const TONE_CLASSES = {
  neutral: "bg-muted text-muted-foreground",
  warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  error: "bg-destructive/10 text-destructive",
} as const;

/**
 * Full-page status card — 404, 500 and the locale-level error boundaries all
 * render this shape with a different icon tone and copy.
 */
export function StatusPage({
  tone = "neutral",
  icon,
  code,
  title,
  titleId,
  body,
  digest,
  actions,
}: {
  tone?: keyof typeof TONE_CLASSES;
  icon?: ReactNode;
  code?: string;
  title: string;
  /** Id the section's aria-labelledby points at. */
  titleId: string;
  body?: ReactNode;
  /** Error digest surfaced by the Next error boundaries. */
  digest?: string;
  actions?: ReactNode;
}) {
  return (
    <section
      className="flex min-h-[60vh] items-center justify-center px-4 py-12"
      aria-labelledby={titleId}
    >
      <div className="flex w-full max-w-[520px] flex-col items-center rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        {icon !== undefined ? (
          <span
            className={`mb-4 inline-flex size-16 items-center justify-center rounded-full ${TONE_CLASSES[tone]}`}
          >
            {icon}
          </span>
        ) : null}
        {code !== undefined ? (
          <p className="mt-0 mb-1 text-xs font-bold tracking-widest uppercase text-muted-foreground">
            {code}
          </p>
        ) : null}
        <h1 id={titleId} className="mt-0 mb-3 text-xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {body !== undefined ? (
          <p className="mt-0 mb-6 text-sm leading-relaxed text-muted-foreground">{body}</p>
        ) : null}
        {digest !== undefined ? (
          <span className="mb-6 block rounded-md border border-border/50 bg-muted/60 px-2.5 py-1 font-mono text-xs text-muted-foreground">
            {digest}
          </span>
        ) : null}
        {actions !== undefined ? (
          <div className="flex w-full flex-wrap justify-center gap-3">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}
