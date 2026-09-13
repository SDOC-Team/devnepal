import type { PublicMemberDto, SelfMemberDto } from "@gov-portal/shared";

export const API_BASE: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type ApiErrorBody = { error?: { message?: string } };

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { credentials: "include" });
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

export async function fetchOwnProfile(): Promise<SelfMemberDto | null> {
  try {
    const payload = await apiFetch<{ member: SelfMemberDto }>("/profile");
    return payload.member;
  } catch {
    return null;
  }
}
