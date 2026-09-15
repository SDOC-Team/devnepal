"use client";

import { SWRConfig } from "swr";

import { apiFetch } from "@/lib/api-client";

/**
 * App-wide SWR defaults. `fetcher` resolves a request key string through the
 * shared apiFetch client; individual hooks override `shouldRetryOnError`
 * where a 401/403 is an expected, non-retryable outcome (e.g. signed out).
 */
export function SwrProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (key: string) => apiFetch(key),
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
