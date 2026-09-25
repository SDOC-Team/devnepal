import type { AdminMemberDto, PublicMemberDto, SelfMemberDto } from "@gov-portal/shared";

import type { Member } from "@/db/schema";

export function avatarUrlFor(member: Member): string | null {
  if (member.avatarPath === null) {
    return null;
  }
  return `/avatars/${member.avatarPath.replace(/^avatars\//, "")}`;
}

export function toPublicMemberDto(member: Member): PublicMemberDto {
  return {
    githubId: member.githubId,
    githubUsername: member.githubUsername,
    displayName: member.displayName,
    headline: member.headline,
    affiliation: member.affiliation,
    location: member.location,
    bio: member.bio,
    links: member.links,
    skills: member.skills as PublicMemberDto["skills"],
    avatarUrl: avatarUrlFor(member),
  };
}

export function toSelfMemberDto(member: Member): SelfMemberDto {
  return {
    ...toPublicMemberDto(member),
    id: member.id,
    status: member.status,
    approvedAt: member.approvedAt?.toISOString() ?? null,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
  };
}

export function toAdminMemberDto(member: Member): AdminMemberDto {
  return {
    ...toSelfMemberDto(member),
    priority: member.priority,
    approvedBy: member.approvedBy,
  };
}
