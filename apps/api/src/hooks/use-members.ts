import type { Member } from "@gov-portal/api-client";
import useSWR from "swr";

import { apiClient } from "@/lib/api-client";

/** Full public member directory (no filters — filtering happens client-side). */
export function useMembers() {
  const { data, error, isLoading } = useSWR<Member[]>("/v1/members", () => apiClient.listMembers());
  return {
    members: data ?? [],
    isLoading,
    error: error as Error | undefined,
  };
}

/** A single public member profile by GitHub username. */
export function useMember(username: string | undefined) {
  const fetchMember = username === undefined ? null : () => apiClient.getMember(username);
  const { data, error, isLoading } = useSWR<Member>(
    username !== undefined ? `/v1/members/${encodeURIComponent(username)}` : null,
    fetchMember,
  );
  return {
    member: data,
    isLoading,
    error: error as Error | undefined,
  };
}
