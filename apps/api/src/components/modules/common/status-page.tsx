import type { ReactNode } from "react";

const TONE_CLASSES = {
  neutral: "bg-neutral-100 text-neutral-600",
  warn: "bg-attention-subtle text-attention",
  error: "bg-error-subtle text-error",
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
      className="flex min-h-[60vh] items-center justify-center px-4 py-10"
      aria-labelledby={titleId}
    >
      <div className="flex w-full max-w-[520px] flex-col items-center rounded-lg border border-divider bg-paper px-6 py-8 text-center shadow-[0_4px_20px_rgb(0_0_0/0.05)]">
        {icon !== undefined ? (
          <span
            className={`mb-4 inline-flex size-[72px] items-center justify-center rounded-circle ${TONE_CLASSES[tone]}`}
          >
            {icon}
          </span>
        ) : null}
        {code !== undefined ? (
          <p className="mt-0 mb-1 text-xs font-bold tracking-[0.1em] uppercase text-neutral-600">
            {code}
          </p>
        ) : null}
        <h1 id={titleId} className="mt-0 mb-3 text-xl leading-tight font-bold">
          {title}
        </h1>
        {body !== undefined ? (
          <p className="mt-0 mb-6 text-base leading-[1.6] text-neutral-700">{body}</p>
        ) : null}
        {digest !== undefined ? (
          <span className="mt-2 block font-mono text-xs text-neutral-600">{digest}</span>
        ) : null}
        {actions !== undefined ? (
          <div className="flex w-full flex-wrap justify-center gap-3">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}
