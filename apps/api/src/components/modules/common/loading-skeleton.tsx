import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Indeterminate top rail. A page-level progress bar is the convention for
 * institutional sites: it signals activity without the "generic app spinner"
 * read, and it sits outside the content so the skeleton below stays the thing
 * you actually look at.
 */
function ProgressRail() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-border/60">
      <div className="loading-rail h-full w-2/5 rounded-full bg-primary" />
    </div>
  );
}

function Line({ className }: { className?: string }) {
  return <div className={cn("skel h-4 rounded-md", className)} />;
}

/** Masthead placeholder: kicker, title, lede — the shape every page opens with. */
function HeaderBlock() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="min-w-0 flex-1">
        <Line className="h-3 w-24" />
        <div className="skel mt-3 h-9 w-[min(420px,60%)] rounded-lg" />
        <Line className="mt-4 w-[min(560px,85%)]" />
        <Line className="mt-2 w-[min(380px,55%)]" />
      </div>
      <div className="flex flex-none gap-6">
        <div>
          <div className="skel h-7 w-10 rounded-md" />
          <Line className="mt-2 h-3 w-16" />
        </div>
        <div>
          <div className="skel h-7 w-10 rounded-md" />
          <Line className="mt-2 h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

/** Card grid — members, projects, step cards. */
function CardsBlock() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((slot) => (
        <div key={slot} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="skel size-12 rounded-full" />
            <div className="min-w-0 flex-1">
              <Line className="w-2/3" />
              <Line className="mt-2 h-3 w-1/2" />
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <div className="skel h-5 w-16 rounded-md" />
            <div className="skel h-5 w-20 rounded-md" />
          </div>
          <div className="mt-5 border-t border-border/60 pt-4">
            <div className="skel h-8 w-28 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Stacked rows — issues, admin queue. */
function RowsBlock() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {[0, 1, 2, 3, 4, 5, 6].map((slot) => (
        <div
          key={slot}
          className="flex items-center gap-4 border-b border-border/60 px-5 py-4 last:border-b-0"
        >
          <div className="skel size-4 flex-none rounded-sm" />
          <div className="min-w-0 flex-1">
            <Line className={slot % 2 === 0 ? "w-3/5" : "w-2/5"} />
            <Line className="mt-2 h-3 w-1/4" />
          </div>
          <div className="skel hidden h-5 w-16 rounded-md sm:block" />
        </div>
      ))}
    </div>
  );
}

/** Single long-form record — an issue or a member profile. */
function DetailBlock() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-xl border border-border bg-card p-6">
        <Line className="w-4/5" />
        <Line className="mt-3 w-full" />
        <Line className="mt-2 w-full" />
        <Line className="mt-2 w-3/4" />
        <div className="mt-6 space-y-2 border-t border-border/60 pt-5">
          <Line className="w-full" />
          <Line className="w-5/6" />
          <Line className="w-2/3" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <Line className="h-3 w-20" />
        <div className="skel mt-3 h-8 w-full rounded-md" />
        <Line className="mt-5 h-3 w-24" />
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="skel h-5 w-14 rounded-md" />
          <div className="skel h-5 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

const LAYOUTS = {
  cards: CardsBlock,
  rows: RowsBlock,
  detail: DetailBlock,
} as const;

export type LoadingLayout = keyof typeof LAYOUTS;

/**
 * Page-level loading state. Renders the shape of the page that is coming
 * rather than a generic spinner, so the layout does not jump when content
 * arrives. `label` is announced; everything visual is hidden from the
 * accessibility tree.
 */
export function LoadingSkeleton({
  label,
  layout = "cards",
  header = true,
  children,
}: {
  label: string;
  layout?: LoadingLayout;
  /** Hide when the caller renders inside an existing masthead. */
  header?: boolean;
  children?: ReactNode;
}): ReactNode {
  const Body = LAYOUTS[layout];

  return (
    <div className="relative w-full py-12" role="status" aria-busy="true" aria-label={label}>
      <ProgressRail />
      <div className="container" aria-hidden="true">
        {header ? <HeaderBlock /> : null}
        <div className={header ? "mt-10" : undefined}>{children ?? <Body />}</div>
      </div>
    </div>
  );
}
