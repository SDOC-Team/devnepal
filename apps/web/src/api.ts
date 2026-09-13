import type {
  AdminMemberDto,
  AdminMemberUpdate,
  PublicMemberDto,
  SelfMemberDto,
} from "@gov-portal/shared";

/** Moderation states. Mirrors memberStatusSchema in @gov-portal/shared. */
export type MemberStatus = "pending" | "approved" | "rejected" | "hidden";

export const API_BASE: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type ApiErrorBody = { error?: { message?: string } };

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...init,
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new Error(payload?.error?.message ?? `Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchMembers(): Promise<PublicMemberDto[]> {
  const payload = await apiFetch<{ members: PublicMemberDto[] }>("/members");
  return payload.members;
}

/** Public profile for one member, by GitHub username. */
export async function fetchMember(username: string): Promise<PublicMemberDto> {
  const payload = await apiFetch<{ member: PublicMemberDto }>(
    `/members/${encodeURIComponent(username)}`,
  );
  return payload.member;
}

export async function fetchOwnProfile(): Promise<SelfMemberDto | null> {
  try {
    const payload = await apiFetch<{ member: SelfMemberDto }>("/profile");
    return payload.member;
  } catch {
    return null;
  }
}

/** Admin queue. Optionally filtered by moderation status. */
export async function fetchAdminMembers(status?: MemberStatus): Promise<AdminMemberDto[]> {
  const query = status === undefined ? "" : `?status=${status}`;
  const payload = await apiFetch<{ members: AdminMemberDto[] }>(`/admin/members${query}`);
  return payload.members;
}

/** Approve, reject, hide or re-prioritise a member. */
export async function updateAdminMember(
  id: string,
  update: AdminMemberUpdate,
): Promise<AdminMemberDto> {
  const payload = await apiFetch<{ member: AdminMemberDto }>(`/admin/members/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(update),
  });
  return payload.member;
}
