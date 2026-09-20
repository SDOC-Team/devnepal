import type { AdminMember, AdminMemberUpdate } from "@gov-portal/api-client";
import useSWR from "swr";

import { apiClient } from "@/lib/api-client";

export const ADMIN_TABS = ["pending", "approved", "rejected", "hidden"] as const;
export type AdminTab = (typeof ADMIN_TABS)[number];

/** Admin member queue for one status tab, with an `update` mutation that
 * revalidates the list afterwards so the row reflects the new state. */
export function useAdminMembers(status: AdminTab) {
  const { data, error, isLoading, mutate } = useSWR<AdminMember[]>(
    `/v1/admin/members?status=${status}`,
    () => apiClient.listAdminMembers(status),
  );

  async function update(memberId: string, patch: AdminMemberUpdate): Promise<void> {
    await apiClient.updateAdminMember(memberId, patch);
    await mutate();
  }

  return {
    members: data ?? [],
    isLoading,
    error: error as Error | undefined,
    update,
  };
}
