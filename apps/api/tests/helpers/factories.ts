import { db } from "@/db/client";
import type { Member, MemberStatus } from "@/db/schema";
import { members } from "@/db/schema";

export const ADMIN_GITHUB_ID = 424242;

let sequence = 0;

type MemberOverrides = {
  githubId?: number;
  githubUsername?: string;
  displayName?: string;
  headline?: string | null;
  affiliation?: string | null;
  location?: string | null;
  bio?: string | null;
  links?: string[];
  skills?: string[];
  status?: MemberStatus;
  priority?: number;
  approvedAt?: Date | null;
  approvedBy?: string | null;
  avatarPath?: string | null;
};

export async function createMember(overrides: MemberOverrides = {}): Promise<Member> {
  sequence += 1;
  const rows = await db
    .insert(members)
    .values({
      githubId: overrides.githubId ?? 900000 + sequence,
      githubUsername: overrides.githubUsername ?? `member-${sequence}`,
      displayName: overrides.displayName ?? `Member ${sequence}`,
      headline: overrides.headline ?? null,
      affiliation: overrides.affiliation ?? null,
      location: overrides.location ?? null,
      bio: overrides.bio ?? null,
      links: overrides.links ?? [],
      skills: overrides.skills ?? [],
      status: overrides.status ?? "pending",
      priority: overrides.priority ?? 0,
      approvedAt: overrides.approvedAt ?? null,
      approvedBy: overrides.approvedBy ?? null,
      avatarPath: overrides.avatarPath ?? null,
    })
    .returning();
  const created = rows[0];
  if (created === undefined) {
    throw new Error("Failed to create test member");
  }
  return created;
}
