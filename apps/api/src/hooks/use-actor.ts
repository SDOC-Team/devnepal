import type { SelfMemberDto } from "@gov-portal/shared";
import useSWR from "swr";

import { ApiError, isUnauthorized } from "@/lib/api-error";

export type Actor = {
  member: SelfMemberDto;
  isAdmin: boolean;
};

/**
 * The signed-in actor, backed by GET /profile (cookie session). A 401 means
 * "signed out" — an expected state, not an error — so `error` stays
 * undefined and callers branch on `actor === null` once `isLoading` is
 * false. Any other failure is surfaced through `error`.
 */
export function useActor() {
  const { data, error, isLoading, mutate } = useSWR<Actor, ApiError>("/profile", {
    shouldRetryOnError: (err) => !isUnauthorized(err),
  });
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
