import type { ReactNode } from "react";

/**
 * Section masthead used across the landing page: optional kicker and lede on
 * the left, an optional trailing link on the right. Shares its rhythm with
 * PageHeader so a section and a page open the same way.
 */
export function SectionHeading({
  kicker,
  title,
  titleId,
  lede,
  action,
}: {
  kicker?: string;
  title: string;
  titleId: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div className="min-w-0">
        {kicker !== undefined ? (
          <span className="mb-2 block text-sm font-semibold text-primary">{kicker}</span>
        ) : null}
        <h2 id={titleId} className="m-0 leading-[1.08] tracking-[-0.01em]">
          {title}
        </h2>
        {lede !== undefined ? (
          <p className="mt-3 max-w-[68ch] text-base leading-[1.55] text-muted-foreground">{lede}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
