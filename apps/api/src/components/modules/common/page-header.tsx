import type { ReactNode } from "react";

/**
 * Standard page masthead: kicker, title, lede, and an optional trailing slot
 * (a count, a filter, an action). Mirrors the landing page's section heading
 * so every route opens with the same rhythm.
 */
export function PageHeader({
  kicker,
  title,
  lede,
  titleId,
  aside,
}: {
  kicker?: string;
  title: string;
  lede?: string;
  /** Id referenced by the section's aria-labelledby. */
  titleId: string;
  aside?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div className="min-w-0">
        {kicker !== undefined ? (
          <p className="mb-2 block text-sm font-semibold text-accent-700">{kicker}</p>
        ) : null}
        <h1 id={titleId} className="tracking-[-0.01em] leading-[1.08]">
          {title}
        </h1>
        {lede !== undefined ? (
          <p className="mt-3 max-w-[68ch] text-base leading-[1.55] text-neutral-700">{lede}</p>
        ) : null}
      </div>
      {aside !== undefined ? (
        <div className="flex-none text-sm text-neutral-700">{aside}</div>
      ) : null}
    </header>
  );
}
