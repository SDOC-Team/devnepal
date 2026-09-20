import type { ProfileResponse } from "@gov-portal/api-client";
import useSWR from "swr";

import { apiClient } from "@/lib/api-client";
import { ApiError, isUnauthorized } from "@/lib/api-error";

export type Actor = ProfileResponse;

/**
 * The signed-in actor, backed by GET /v1/profile (cookie session). A 401 means
 * "signed out" — an expected state, not an error — so `error` stays
 * undefined and callers branch on `actor === null` once `isLoading` is
 * false. Any other failure is surfaced through `error`.
 */
export function useActor() {
  const { data, error, isLoading, mutate } = useSWR<Actor, ApiError>(
    "/v1/profile",
    () => apiClient.getProfile(),
    { shouldRetryOnError: (err) => !isUnauthorized(err) },
  );
  const signedOut = error instanceof ApiError && error.status === 401;
  return {
    actor: data ?? null,
    isLoading,
    isSignedOut: signedOut,
    error: signedOut ? undefined : (error as Error | undefined),
    /** Re-fetch after sign-in/out or a profile mutation. */
    refresh: mutate,
  };
}
