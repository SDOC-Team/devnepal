import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

import { type LoadingLayout, LoadingSkeleton } from "./loading-skeleton";
import { StateBanner } from "./state-banner";

/**
 * Inline loading/error rendering for a client-fetched SWR resource — the
 * in-page counterpart to loading.tsx/error.tsx, which only cover the RSC
 * suspense boundary and never fire for a client component's own fetch.
 */
export function LoadingPanel({
  label,
  layout = "cards",
}: {
  label: string;
  layout?: LoadingLayout;
}): ReactNode {
  return <LoadingSkeleton label={label} layout={layout} />;
}

export function ErrorPanel({
  title,
  message,
  onRetry,
  retryLabel,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}): ReactNode {
  return (
    <StateBanner tone="danger" role="alert">
      <strong className="text-destructive">{title}</strong>
      <p className="mt-1 mb-0 text-destructive">{message}</p>
      {onRetry !== undefined ? (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </StateBanner>
  );
}
