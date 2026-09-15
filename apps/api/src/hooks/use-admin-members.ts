import type { AdminMemberDto, AdminMemberUpdate } from "@gov-portal/shared";
import useSWR from "swr";

import { apiMutate } from "@/lib/api-client";

export const ADMIN_TABS = ["pending", "approved", "rejected", "hidden"] as const;
export type AdminTab = (typeof ADMIN_TABS)[number];

/** Admin member queue for one status tab, with an `update` mutation that
 * revalidates the list afterwards so the row reflects the new state. */
export function useAdminMembers(status: AdminTab) {
  const { data, error, isLoading, mutate } = useSWR<{ members: AdminMemberDto[] }>(
    `/admin/members?status=${status}`,
  );

  async function update(memberId: string, patch: AdminMemberUpdate): Promise<void> {
    await apiMutate<{ member: AdminMemberDto }>(`/admin/members/${memberId}`, "PATCH", patch);
    await mutate();
  }

  return {
    members: data?.members ?? [],
    isLoading,
    error: error as Error | undefined,
    update,
  };
}
