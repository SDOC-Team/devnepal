"use client";

import { SWRConfig } from "swr";

/**
 * App-wide SWR defaults. Product hooks supply typed OpenAPI client functions
 * as their fetchers; individual hooks handle expected 401/403/404 states.
 */
export function SwrProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
