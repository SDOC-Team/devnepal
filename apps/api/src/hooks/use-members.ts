import type { PublicMemberDto } from "@gov-portal/shared";
import useSWR from "swr";

/** Full public member directory (no filters — filtering happens client-side). */
export function useMembers() {
  const { data, error, isLoading } = useSWR<{ members: PublicMemberDto[] }>("/members");
  return {
    members: data?.members ?? [],
    isLoading,
    error: error as Error | undefined,
  };
}

/** A single public member profile by GitHub username. */
export function useMember(username: string | undefined) {
  const { data, error, isLoading } = useSWR<{ member: PublicMemberDto }>(
    username !== undefined ? `/members/${encodeURIComponent(username)}` : null,
  );
  return {
    member: data?.member,
    isLoading,
    error: error as Error | undefined,
  };
}
