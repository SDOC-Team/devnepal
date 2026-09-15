import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

import { StateBanner } from "./state-banner";

/**
 * Inline loading/error rendering for a client-fetched SWR resource — the
 * in-page counterpart to loading.tsx/error.tsx, which only cover the RSC
 * suspense boundary and never fire for a client component's own fetch.
 */
export function LoadingPanel({ label }: { label: string }): ReactNode {
  return (
    <div className="w-full px-4 py-8" role="status" aria-busy="true" aria-label={label}>
      <div className="mx-auto flex max-w-[1100px] justify-center">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="17" stroke="var(--color-divider)" strokeWidth="3" />
          <path
            d="M20 3a17 17 0 0 1 17 17"
            stroke="var(--color-accent-700)"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 20 20"
              to="360 20 20"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </div>
  );
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
      <strong className="text-error">{title}</strong>
      <p className="mt-1 mb-0 text-error">{message}</p>
      {onRetry !== undefined ? (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </StateBanner>
  );
}
